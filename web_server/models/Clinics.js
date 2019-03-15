var mongoose = require('mongoose');

var ClinicSchema = mongoose.Schema({
  name: String,
  clinic_id: Number,
  address: String,
  wait_time: Number,
  num_patients: Number,
  patients: [Object],
})

module.exports = mongoose.model('Clinics', ClinicSchema);