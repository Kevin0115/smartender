var mongoose = require('mongoose');

var AnalyticsSchema = mongoose.Schema({
  count: Number,
  timestamp: String
})

module.exports = mongoose.model('Analytics', AnalyticsSchema);