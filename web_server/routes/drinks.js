var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Create a New Drink
router.post('/', function(req, res) {
  Drinks.create({
    name: req.body.name,
    drink_id: req.body.drink_id,
    recipe: req.body.recipe
  }, function(err, drink) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send(drink);
    }
  })
})

module.exports = router;