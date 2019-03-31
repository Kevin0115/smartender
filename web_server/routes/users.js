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
      fetch(constants.BARCOIN_SERVER_URL + '/operator/' + user.wallet.id + '/balance', {
        method: 'GET',
      })
      .then(res => res.json())
      .then(json => res.send(json))
      .catch(error => console.log('Error: ' + error.message));
    }
  })
})

// Update User Balance - DEPRECATED (?) from Barcoin
router.put('/:user_id/balance', function(req, res) {
  var user_id = req.params.user_id;
  var price = req.body.price;
  Users.findOne({id: user_id})
  .exec(function(err, user) {
    if (user == undefined) {
      res.send({status: 'User Does Not Exist'});
    } else {
      var currBalance = user.balance;
      if (currBalance - price < 0) {
        res.send({status: 'Insufficient Funds'});
      } else {
        Users.updateOne(
          {id: user_id},
          {$inc: {balance: -1*price}}
        )
        .exec(function(err, user) {
          if(err) {
            res.send({status: 'Error'});
          } else {
            res.send({status: 'Balance Updated'});
          }
        })
      }
    }
  })
})

router.put('/:user_id/wallet', function(req, res) {
  var user_id = req.params.user_id;
  var wallet_address = req.body.walletAddress

  fetch(constants.BARCOIN_SERVER_URL + '/miner/mine', {
  method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      rewardAddress: wallet_address,
      needsReward: true
    })
  })
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(error => console.log('Error: ' + error.message));  
})

module.exports = router;