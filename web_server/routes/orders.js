var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var fetch = require('node-fetch');

// TEMPORARY TESTING
var PI_URL = 'https://smartender-5t3k-qc8z.try.yaler.io/';
var SERVER_URL = 'http://ec2-13-58-113-143.us-east-2.compute.amazonaws.com/';

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
  var currInventory = [];
  var newInventory = [];

  // First, find machine in Machines and THEN send the order.
  // Right now, we're assuming and working with one machine
  Machines.findOne({machine_id: machine_id})
  .exec(function(err, machine) {
    if(err || machine == undefined) {
      res.send({status: 'Error'});
    } else {
      currInventory = machine.drinks;
      Drinks.findOne({drink_id: drink_id})
      .exec(function(err, drink) {
        if (err || drink == undefined) {
          res.send({status: 'Error'});
        } else {
          recipe = drink.recipe;

          try {
            newInventory = utils.updateInventory(currInventory, recipe);
          }
          catch(err) {
            console.log(err);
            res.send({status: 'No Inventory'});
          }
          console.log('NEW INVENTORY: ' + JSON.stringify(newInventory));

          // API call to self/machines/:machine_id to update inventory
          fetch(SERVER_URL + 'machines/' + machine_id, {
            method: 'PUT',
            // body: JSON.stringify({message: "Pouring " + username + "'s drink!"}),
            body: JSON.stringify(newInventory),
          })
          .then(res => res.json())
          .then(json => console.log(json))
          .catch(error => console.log('Error: ' + error.message));

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
            body: JSON.stringify(order),
          })
          .then(res => res.json())
          .then(json => res.send(json))
          .catch(error => console.log('Error: ' + error.message));
        }
      })
    }
  })

  
})

module.exports = router;