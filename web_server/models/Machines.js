var mongoose = require('mongoose');

var MachineSChema = mongoose.Schema({
  name: String,
  machine_id: Number,
  inventory: [Number],
  drinks: [Object],
  drinks_this_week: Number,
  weekly_log: [Object],
})

module.exports = mongoose.model('Machines', MachineSChema);