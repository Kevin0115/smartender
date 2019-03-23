var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Get all Drinks
router.get('/', function(req, res) {
  Drinks.find({})
  .exec(function(err, drinks) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(drinks);
    }
  })
})

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
      res.send({status: 'Drink Created'});
    }
  })
})

module.exports = router;