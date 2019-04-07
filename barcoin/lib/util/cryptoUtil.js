const crypto = require('crypto');

class CryptoUtil {
    static hash(any) {
        let anyString = typeof (any) == 'object' ? JSON.stringify(any) : any.toString();
        let anyHash = crypto.createHash('sha256').update(anyString).digest('hex');
        return anyHash;
    }

    static randomId(size = 64) {
        return crypto.randomBytes(Math.floor(size / 2)).toString('hex');
    }

    static hex2Bin(s){
        let ret = '';
        const lookupTable = {
            '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
            '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
            'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
            'e': '1110', 'f': '1111'
        };

        for (let i = 0; i < s.length; i++) {
            if (lookupTable[s[i]]) {
                ret += lookupTable[s[i]];
            } else {
                return null;
            }
        }
        return ret;
    }
}

module.exports = CryptoUtil;