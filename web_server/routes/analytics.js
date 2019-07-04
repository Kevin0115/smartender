var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var constants = require('../utils/const');
var fetch = require('node-fetch');

// Get site analytics
router.get('/', function(req, res) {
  Analytics.find({})
  .exec(function(err, analytics) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(analytics);
    }
  })
})

// Get number of visits
router.get('/count', function(req, res) {
  Analytics.count({})
  .exec(function(err, count) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(count);
    }
  })
})

// Post new site visit
router.post('/', function(req, res) {
  Analytics.create({
    count: 1,
    timestamp: req.body.timestamp
  }, function(err, analytics) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'Count updated'});
    }
  })
})

module.exports = router;