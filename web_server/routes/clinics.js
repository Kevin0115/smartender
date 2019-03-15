var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');

// Twilio SMS information
const accountSid = 'AC0c00be9ab7ec90429a97567d746793fb';
const authToken = '5a6ff9292ae6e207285d71e6533e870a';
const client = require('twilio')(accountSid, authToken);

// TEST NODE MODULES
router.get('/test', function(req, res) {
  res.send(utils.calcDistance(49.265141,-123.249551,49.264178,-123.203832));
})

// Retrieve all clinics
router.get('/', function(req, res) {
  Clinics.find({})
  .exec(function (err, clinics) {
    res.send(clinics);
  })
})

// Retrieve one clinic - for testing
router.get('/:clinic_id', function(req, res) {
  var clinic_id = req.params.clinic_id;

  Clinics.find({clinic_id: clinic_id})
  .exec(function(err, clinic) {
    if (clinic == undefined) {
      res.send('Clinic Does Not Exist');
    } else {
      res.send(clinic);
    }
  })
})

// Add patient to clinic
router.put('/:clinic_id/patients', function(req, res) {
  var clinic_id = req.params.clinic_id;
  var patient = {
    name: req.body.name,
    care_card: req.body.care_card,
    phone: req.body.phone
  };
  var dbflag = req.body.dbflag;
  // Suggestion flag is !dbflag
  var found_alt = false;

  Clinics.findOne({clinic_id: clinic_id})
  .exec(function(err, clinic) {
    if (clinic == undefined) {
      res.send('Specific Clinic Does Not Exist');
    } else {
      // dbflag indicated by DE1
      if ((typeof dbflag === "boolean" && dbflag) ||
        (typeof dbflag === "string" && dbflag === "true")
        ) {
        clinic.patients.push(patient);
        clinic.save(function(err, clinic) {
          if (err) {
            console.log(err);
            res.send('Something Went Wrong');
          } else {
            Clinics.updateOne(
              {clinic_id: clinic_id},
              {$inc: {wait_time: 0.5}}
            )
            .exec(function(err, clinic) {
              // Error Check Here
              res.send(
                {
                  suggestion_flag: false
                }
              );
            })
          }
        });
      } else {
        // if !dbflag, look for alternative locations
        var srcClinic = clinic.toObject();
        
        Clinics.find({})
        .exec(function(err, clinics) {
          for (var index = 0; index < clinics.length; index++) {
            // For every clinic, check its wait time
            if (clinics[index].wait_time < 2) {
              var destClinic = clinics[index].toObject();
              // NOW check distance
              var distBetween = utils.calcDistance(srcClinic.lat, srcClinic.long, destClinic.lat, destClinic.long);
              if (distBetween && distBetween < 2 && srcClinic.clinic_id != destClinic.clinic_id) {
                res.send({
                  name: destClinic.name,
                  wait_time: destClinic.wait_time,
                  waitlist: destClinic.patients.length,
                  address: destClinic.address,
                  clinic_id: destClinic.clinic_id,
                  suggestion_flag: true
                });
                found_alt = true;
                break;
              }
            }
          }
          if (!found_alt) {
            res.send(
            {
              suggestion_flag: false
            }
          );
          }
        })
      }
    }
  })
})

// Pop patient queue
router.delete('/:clinic_id/patients', function(req, res) {
  var clinic_id = req.params.clinic_id;

  Clinics.findOne({clinic_id: clinic_id})
  .exec(function(err, clinic) {
    if (clinic == undefined) {
      res.send('Clinic does not exist');
    } else {
      if (clinic.patients.length > 0) {
        var phone = clinic.patients[0].phone;
        var name = clinic.patients[0].name;
        client.messages
        .create({
           body: 'Thank you for visiting ' + clinic.name + ' ' + name + '!',
           from: '+17784007272',
           to: '+1' + phone
         })
        .then(message => console.log(message.sid));
        Clinics.updateOne(
          {clinic_id: clinic_id},
          {
            $pop: {patients: -1},
            $inc: {wait_time: -0.5} // Can dip below 0
          }
        )
        .exec(function(err, clinic) {
          if (err) {
            console.log(err);
            res.send('Something Went Wrong');
          } else {
            // Send SMS to the next person in line
            Clinics.findOne({clinic_id: clinic_id})
            .exec(function(err, clinic) {
              var phone = clinic.patients[0].phone;
              var name = clinic.patients[0].name;
              // The Twilio API call; consider delegating to a utils function
              client.messages
              .create({
                 body: 'Hi ' + name + '. You are next in line at the clinic. Please return to the clinic if you are not present.',
                 from: '+17784007272',
                 to: '+1' + phone
               })
              .then(message => console.log(message.sid));
            });
            // Send confirmation message as response
            res.send('Successfully removed head of queue');
          }
        });
      } else {
        res.send('No patients to remove');
      }
    }
  });

  
})

// Retrieve clinic's waitlist information
router.get('/:clinic_id/waitlist', function(req, res) {
  var clinic_id = req.params.clinic_id;

  Clinics.findOne({clinic_id: clinic_id})
  .exec(function(err, clinic) {
    if (clinic == undefined) {
      res.send('Clinic Not Found');
    } else {
      res.send(
        {
          waitlist_pos: clinic.patients.length,
          wait_time: clinic.wait_time
        }
      );
    }
  })
})

module.exports = router;