var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

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
  console.log(req.body);
  Users.create({
    username: req.body.username,
    id: req.body.id,
    pic: req.body.pic,
    drink_count: 0,
  }, function(err, user) {
    console.log(user);
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'User Created'});
    }
  })
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

module.exports = router;