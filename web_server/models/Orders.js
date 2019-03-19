var mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({
  drink_id: Number,
  shots: Number,
  username: String
})

module.exports = mongoose.model('Orders', OrderSchema);