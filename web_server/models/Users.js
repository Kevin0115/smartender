var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: String,
  id: String,
  pic: String,
  drink_count: Number,
  balance: Number,
})

module.exports = mongoose.model('Users', UserSchema);