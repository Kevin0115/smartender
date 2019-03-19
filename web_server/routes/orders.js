var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var fetch = require('node-fetch');

// TEMPORARY TESTING
var PI_URL = 'https://smartender-5t3k-qc8z.try.yaler.io/';

router.get('/', function(req, res) {
  res.send('Hello World');
})

// Make an order to machine #id
router.post('/', function(req, res) {
  var machine_id = req.body.machine_id;
  var username = req.body.username;
  var drink_id = req.body.drink_id;
  var name = req.body.name;
  var recipe = [];

  Drinks.findOne({drink_id: drink_id})
  .exec(function(err, drink) {
    if (drink == undefined) {
      res.send('Drink does not exist');
    } else {
      recipe = drink.recipe;
      res.send({
        username: username,
        order: [
          {
            name: name,
            recipe: recipe
          }
        ]
      })
    }
  })
})

// Make an order to machine #id
router.post('/test', function(req, res) {
  var machine_id = req.body.machine_id;
  var username = req.body.username;
  var drink_id = req.body.drink_id;
  var name = req.body.name;
  var recipe = [];

  console.log(req.body);

  Drinks.findOne({drink_id: drink_id})
  .exec(function(err, drink) {
    if (drink == undefined) {
      res.send('Drink does not exist');
    } else {
      recipe = drink.recipe;
      var order = {
        username: username,
        order: [
          {
            name: name,
            recipe: recipe
          }
        ]
      }

      // TESTING ONLY - CHANGE TO ORDER
      fetch(PI_URL + 'test/', {
        method: 'POST',
        body: JSON.stringify({message: 'full integration test'}),
      })
      .then(res => res.json())
      .then(json => res.send(json))
      .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
       // ADD THIS THROW error
        throw error;
      });
    }
  })
})

module.exports = router;