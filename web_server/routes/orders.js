var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var fetch = require('node-fetch');

var PI_URL = 'https://smartender-5t3k-qc8z.try.yaler.io/';
var SERVER_URL = 'http://ec2-13-58-113-143.us-east-2.compute.amazonaws.com/';

// Make an order to machine #id
router.post('/', function(req, res) {
  var machine_id = req.body.machine_id;
  var username = req.body.username;
  var drink_id = req.body.drink_id;
  var name = req.body.name;
  var recipe = [];
  var currInventory = [];
  var newInventory = [];
  var updateFlag = true;

  Machines.findOne({machine_id: machine_id})
  .exec(function(err, machine) {
    if(err || machine == undefined) {
      res.send({status: 'Error'});
    } else {
      currInventory = machine.inventory;
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
            updateFlag = false;
            console.log(err);
          }

          if(updateFlag) {
            // Updates this machine_id's inventory in DB
            fetch(SERVER_URL + 'machines/' + machine_id, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({inventory: newInventory}),
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

            // With multiple machines, would index machine_id in a library of
            // machine_id to URL pairs.
            // For now, we direct ALL orders to the same machine, regardless of id
            fetch(PI_URL + 'order/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(order),
            })
            .then(res => res.json())
            .then(json => res.send(json))
            .catch(error => console.log('Error: ' + error.message));
          } else {
            res.send({status: 'No Inventory'});
          }
        }
      })
    }
  })
})

module.exports = router;