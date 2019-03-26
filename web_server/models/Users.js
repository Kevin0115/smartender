var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: String,
  id: Number,
  pic: String,
  drink_count: Number,
})

module.exports = mongoose.model('Users', UserSchema);