var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: String,
  id: String,
  pic: String,
  drink_count: Number,
  balance: Number,
  wallet: Object
})

module.exports = mongoose.model('Users', UserSchema);