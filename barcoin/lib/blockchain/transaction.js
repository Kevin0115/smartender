const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');
const CryptoEdDSAUtil = require('../util/cryptoEdDSAUtil');
const TransactionAssertionError = require('./transactionAssertionError');
const Config = require('../config');

// Transaction structure in JASON format:
// { // Transaction
//     "id": "84286bba8d...7477efdae1", // random id (64 bytes)
//     "hash": "f697d4ae63...c1e85f0ac3", // hash taken from the contents of the transaction: sha256 (id + data) (64 bytes)
//     "type": "regular", // transaction type (regular, reward (optionally fee))
//     "data": {
//         "inputs": [ // Transaction inputs
//             {
//                 "transaction": "9e765ad30c...e908b32f0c", // transaction hash taken from a previous unspent transaction output (64 bytes)
//                 "index": "0", // index of the transaction taken from a previous unspent transaction output
//                 "amount": 50, // amount of BarCoins
//                 "address": "dda3ce5aa5...b409bf3fdc", // from address (64 bytes)
//                 "signature": "27d911cac0...6486adbf05" // transaction input hash: sha256 of input transaction's data signed with owner address's secret key (128 bytes)
//             }
//         ],
//         "outputs": [ // Transaction outputs
//             {
//                 "amount": 10, // amount of BarCoins
//                 "address": "4f8293356d...b53e8c5b25" // to address (64 bytes)
//             },
//             {
//                 "amount": 40, // amount of BarCoins
//                 "address": "dda3ce5aa5...b409bf3fdc" // change address (64 bytes)
//             }
//         ]
//     }
// }

class Transaction {
    construct() {
        this.id = null;
        this.hash = null;
        this.type = null;
        this.data = {
            inputs: [],
            outputs: []
        };
    }

    toHash() {
        // INFO: There are different implementations of the hash algorithm, for example: https://en.bitcoin.it/wiki/Hashcash
        return CryptoUtil.hash(this.id + this.type + JSON.stringify(this.data));
    }

    check() {
        // Check if the transaction hash is correct
        let isTransactionHashValid = this.hash == this.toHash();

        if (!isTransactionHashValid) {
            console.error(`Invalid transaction hash '${this.hash}'`);
            throw new TransactionAssertionError(`Invalid transaction hash '${this.hash}'`, this);
        }

        // Check if the signature of all input transactions are correct (transaction data is signed by the public key of the address)
        R.map((txInput) => {
            let txInputHash = CryptoUtil.hash({
                transaction: txInput.transaction,
                index: txInput.index,
                address: txInput.address
            });
            let isValidSignature = CryptoEdDSAUtil.verifySignature(txInput.address, txInput.signature, txInputHash);

            if (!isValidSignature) {
                console.error(`Invalid transaction input signature '${JSON.stringify(txInput)}'`);
                throw new TransactionAssertionError(`Invalid transaction input signature '${JSON.stringify(txInput)}'`, txInput);
            }
        }, this.data.inputs);


        if (this.type == 'regular') {
            // Check if the sum of input transactions are greater than output transactions, it needs to leave some room for the transaction fee
            let sumOfInputsAmount = R.sum(R.map(R.prop('amount'), this.data.inputs));
            let sumOfOutputsAmount = R.sum(R.map(R.prop('amount'), this.data.outputs));

            let isInputsAmountGreaterOrEqualThanOutputsAmount = R.gte(sumOfInputsAmount, sumOfOutputsAmount);

            if (!isInputsAmountGreaterOrEqualThanOutputsAmount) {
                console.error(`Invalid transaction balance: inputs sum '${sumOfInputsAmount}', outputs sum '${sumOfOutputsAmount}'`);
                throw new TransactionAssertionError(`Invalid transaction balance: inputs sum '${sumOfInputsAmount}', outputs sum '${sumOfOutputsAmount}'`, { sumOfInputsAmount, sumOfOutputsAmount });
            }

            let isEnoughFee = (sumOfInputsAmount - sumOfOutputsAmount) >= Config.FEE_PER_TRANSACTION; // because there could be a fee per transaction

            if (!isEnoughFee) {
                console.error(`Not enough fee: expected '${Config.FEE_PER_TRANSACTION}' got '${(sumOfInputsAmount - sumOfOutputsAmount)}'`);
                throw new TransactionAssertionError(`Not enough fee: expected '${Config.FEE_PER_TRANSACTION}' got '${(sumOfInputsAmount - sumOfOutputsAmount)}'`, { sumOfInputsAmount, sumOfOutputsAmount, FEE_PER_TRANSACTION: Config.FEE_PER_TRANSACTION });
            }
        }

        return true;
    }

    static fromJson(data) {
        let transaction = new Transaction();
        R.forEachObjIndexed((value, key) => { transaction[key] = value; }, data);
        transaction.hash = transaction.toHash();
        return transaction;
    }
}

module.exports = Transaction;
