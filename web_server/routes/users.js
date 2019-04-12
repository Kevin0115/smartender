var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var constants = require('../utils/const');
var fetch = require('node-fetch');

// Get all users in system
router.get('/', function(req, res) {
  Users.find({})
  .exec(function(err, users) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(users);
    }
  })
})

// Initialize new user
router.post('/', function(req, res) {
  var user_id = req.body.id;
  var username = req.body.username;
  var wallet = {};

  fetch(constants.BARCOIN_SERVER_URL + '/operator/wallets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: username})
  })
  .then(res => res.json())
  .then(json => wallet = json)
  .then(() => {
    Users.findOne({id: user_id})
    .exec(function(err, user) {
      // If user doesn't already exist, insert
      if (user == undefined) {
        Users.create({
          username: req.body.username,
          id: req.body.id,
          pic: req.body.pic,
          drink_count: 0,
          balance: 0,
          wallet: wallet
        }, function(err, user) {
          if(err) {
            res.send({status: 'Error'});
          } else {
            res.send({status: 'User Created'});
          }
        })
      // Otherwise, don't insert new user
      } else {
        res.send({status: 'User Already Exists'});
      }
    })
  })
  .catch(error => console.log('Error: ' + error.message));
})

// Get a user by ID
router.get('/:user_id', function(req, res) {
  var user_id = req.params.user_id;
  Users.findOne({id: user_id})
  .exec(function(err, user) {
    if (user == undefined) {
      res.send({status: 'User Does Not Exist'});
    } else {
      res.send(user);
    }
  })
})

// Increment User Drink Count
router.put('/:user_id/drinks', function(req, res) {
  var user_id = req.params.user_id;
  var drinks = req.body.drinks;
  Users.updateOne(
    {id: user_id},
    {$inc: {drink_count: drinks}}
  )
  .exec(function(err, user) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'Drink Count Updated'});
    }
  })
})

// Get User Balance
router.get('/:user_id/balance', function(req, res) {
  var user_id = req.params.user_id;
  Users.findOne({id: user_id})
  .exec(function(err, user) {
    if (user == undefined) {
      res.send({status: 'User Does Not Exist'});
    } else {
      var walletAddress = user.wallet.addresses[0];
      fetch(constants.BARCOIN_SERVER_URL + '/operator/' + walletAddress + '/balance', {
        method: 'GET',
      })
      .then(res => res.json())
      .then(json => res.send(json))
      .catch(error => console.log('Error: ' + error.message));
    }
  })
})


// Upon ordering, creates a blockchain transaction
router.post('/:user_id/transaction', function(req, res) {
  var user_id = req.params.user_id;
  var price = req.body.price;

  Users.findOne({id: user_id})
  .exec(function(err, user) {
    if (user == undefined) {
      res.send({status: 'User Does Not Exist'});
    } else {
      var username = user.username;
      var walletID = user.wallet.id;
      var walletAddress = user.wallet.addresses[0];
      fetch(constants.BARCOIN_SERVER_URL + '/operator/wallets/' + walletID + '/transactions', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
        },
        body: JSON.stringify({
          fromAddress: walletAddress,
          toAddress: constants.BARCOIN_ADDRESS,
          amount: price
        })
      })
      .then(res => res.json())
      .then(json => console.log(json))
      .then(() => {
        fetch(constants.SERVER_URL + '/users/' + user_id + '/wallet', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: walletAddress,
            reward: false
          })
        })
        .then(res => res.json())
        .then(json => res.send(json));
      })
      .catch(error => console.log('Error: ' + error.message)); 
    }
  })
})

// Updates user's crypto wallet upon mining
router.put('/:user_id/wallet', function(req, res) {
  var user_id = req.params.user_id;
  var wallet_address = req.body.walletAddress
  var reward = req.body.reward;

  fetch(constants.BARCOIN_SERVER_URL + '/miner/mine', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rewardAddress: wallet_address,
      needsReward: reward
    })
  })
  .then(res => res.json())
  .then(json => res.send(json))
  .catch(error => console.log('Error: ' + error.message));  
})

module.exports = router;