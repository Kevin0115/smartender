var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Get the information of all smartender machines
router.get('/', function(req, res) {
  Machines.find({})
  .exec(function(err, machines) {
    if(err) {
      res.send({status: 'Error'})
    } else {
      res.send(machines);
    }
  })
})

// ADMIN ONLY - initialize a new smartender in the DB
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
      res.send({status: 'Machine Initialized'});
    }
  })
})

// PI-TO-SERVER - Update the inventory of a machine (itself)
// Intermediate inventory tracking is handled by the server itself
router.put('/:machine_id/inventory', function(req, res) {
  var machine_id = req.params.machine_id;
  Machines.updateOne(
    {machine_id: machine_id},
    {inventory: req.body.inventory}
  )
  .exec(function(err, machine) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'Inventory Updated'});
    }
  })
})

// INTERNAL SERVER - During an /order request, if successful,
// analytics data (revenue and num_drinks) are updated
router.put('/:machine_id/data', function(req, res) {
  var machine_id = req.params.machine_id;
  var revenue = req.body.revenue;
  Machines.updateOne(
    {machine_id: machine_id},
    {$inc: {drinks_this_week: 1, revenue_this_week: revenue}}
  )
  .exec(function(err, machine) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'Stats Updated'});
    }
  })
})

module.exports = router;