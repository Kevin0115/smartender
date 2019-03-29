var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var constants = require('../utils/const');
var fetch = require('node-fetch');

// Make an order to machine #id
router.post('/', function(req, res) {
  var machine_id = req.body.machine_id;
  var username = req.body.username;
  var user_id = req.body.user_id;
  var drink_id = req.body.drink_id;
  var name = req.body.name;
  var price = req.body.price;
  var shots = req.body.shots;
  var recipe = [];
  var currInventory = [];
  var newInventory = [];
  var updateFlag = true;
  var balanceFlag = true;

  Machines.findOne({machine_id: machine_id})
  .exec(function(err, machine) {
    if(err || machine == undefined) {
      res.send({status: 'Error'});
    } else {
      // Machine exists, now check user balance
      fetch(constants.SERVER_URL + '/users/' + user_id + '/balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({price: price}),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        balanceFlag = json.status !== 'Insufficient Funds';
      })
      .catch(error => console.log('Error: ' + error.message));

      if (balanceFlag) {

        currInventory = machine.inventory;
        Drinks.findOne({drink_id: drink_id})
        .exec(function(err, drink) {
          if (err || drink == undefined) {
            res.send({status: 'Error'});
          } else {
            // We need to adjust the recipe according to shots
            recipe = utils.updateRecipe(drink.recipe, shots);
            try {
              newInventory = utils.updateInventory(currInventory, recipe);
            }
            catch(err) {
              updateFlag = false;
              console.log(err);
            }

            if(updateFlag) {
              // Updates this machine_id's inventory in DB
              fetch(constants.SERVER_URL + '/machines/' + machine_id + '/inventory', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({inventory: newInventory}),
              })
              .then(res => res.json())
              .then(json => console.log(json))
              .catch(error => console.log('Error: ' + error.message));

              // Update the analytics data
              fetch(constants.SERVER_URL + '/machines/' + machine_id + '/data', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({revenue: price}),
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

              // Index the machine dict by machine_id to get proper URL
              // Right now they're all the same. Theoretically each would be its own URL
              var PI_URL = constants.PI_URL_DICT[machine_id];
              // For Testing, use this
              var TEST_PI_URL = constants.TEST_PI_URL;

              fetch(TEST_PI_URL + '/order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(order),
              })
              .then(res => res.json())
              .then(json => {
                console.log(json);
                res.send(json);
              })
              .catch(error => console.log('Error: ' + error.message));
            } else {
              res.send({status: 'No Inventory'});
            }
          }
        })
      } else {
        res.send({status: 'Insufficient Funds'});
      }
    }
  })
})

module.exports = router;