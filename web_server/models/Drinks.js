var mongoose = require('mongoose');

var DrinkSchema = mongoose.Schema({
  name: String,
  drink_id: Number,
  recipe: [Number]
})

module.exports = mongoose.model('Drinks', DrinkSchema);