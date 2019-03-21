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

  // First, find machine in Machines and THEN send the order.
  // Right now, we're assuming and working with one machine

  Drinks.findOne({drink_id: drink_id})
  .exec(function(err, drink) {
    if (drink == undefined) {
      res.send({status: 'Drink Does Not Exist'});
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
      // Insert API call here, and res.send a confirmation
      // TESTING ONLY - CHANGE TO ORDER
      fetch(PI_URL + 'order/', {
        method: 'POST',
        // body: JSON.stringify({message: "Pouring " + username + "'s drink!"}),
        body: JSON.stringify({message: "Pouring " + username + "'s drink!"}),
      })
      .then(res => res.json())
      .then(json => res.send(oh))
      .catch(function(error) {
        console.log('Error: ' + error.message);
        // ADD THIS THROW error
        throw error;
      });
    }
  })
})

module.exports = router;