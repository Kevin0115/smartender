var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Get the information of all smartender machines
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
      res.send(machine);
    }
  })
})

// PI-TO-SERVER update the inventory of a machine (itself)
router.put('/:machine_id', function(req, res) {
  var machine_id = req.params.machine_id;
  Machines.findOne(
    {machine_id: machine_id},
    {drinks: req.body.inventory}
  )
  .exec(function(err, machine) {
    if(err) {
      res.send({status: 'Error'});
    } else {
      res.send({status: 'OK'});
    }
  })
})

module.exports = router;