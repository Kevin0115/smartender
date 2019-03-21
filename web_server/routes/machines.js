var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Create a New Drink
router.get('/', function(req, res) {
  Machines.find({})
  .exec(function(err, drinks) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(drinks);
    }
  })
})

router.post('/', function(req, res) {
  Machines.create({
    name: req.body.name,
    machine_id: req.body.machine_id,
    drinks: req.body.drinks,
    drinks_this_week: req.body.drinks_this_week,
    weekly_log: req.body.weekly_log
  }, function(err, machine) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send(machine);
    }
  })
})

module.exports = router;