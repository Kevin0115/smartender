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
  Analytics.countDocuments({})
  .exec(function(err, count) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send({count: count});
    }
  })
})

// Post new site visit
router.post('/', function(req, res) {
  // Log every visit to console; debugging
  console.log('New Visit ID: ' + req.body.sessionId);
  Analytics.findOne({sessionId: req.body.sessionId})
  .exec(function(err, sessionId) {
    if (err) {
      res.send({status: 'Error: ' + err});
    } else if (sessionId == undefined) {
      Analytics.create({
        sessionId: req.body.sessionId,
        events: req.body.events
      }, function(err, analytics) {
        if(err) {
          res.send({status: 'Error: ' + err});
        } else {
          res.send({status: 'New session inserted'});
        }
      });
    } else { 
      if (req.body.events[0].eventType !== 'sessionStart') {
      Analytics.updateOne(
        {sessionId: req.body.sessionId},
        {$push: {events: req.body.events[0]}}
      )
      .exec(function(err, analytics) {
        if (err) {
          res.send({status: 'Error: ' + err});
        } else {
          res.send({status: 'Updated session events'});
        }
      });
      } else {
        Analytics.create({
          sessionId: req.body.sessionId + '_' + Math.floor(Math.random() * 10),
          events: req.body.events,
        }, function(err, analytics) {
          if(err) { res.send({status: 'Error: ' + err}); }
          else { res.send({status: 'Collision session inserted'}); }
        });
      }
    }
  });
})

// Change user.id to proper authentication field (id) or use Passport.js
router.post('/login', function(req, res) {
  Users.findOne({username: req.body.username})
  .exec(function(err, user) {
    if (err) { res.send({status: 'Error: ' + err}); }
    else if (user == undefined) { res.send({status: 'User not found'}); }
    else if (req.body.password != user.id) { res.send({status: 'Incorrect Password'}); }
    else { res.send({status: 'Authenticated'}); }
  })
});

module.exports = router;
