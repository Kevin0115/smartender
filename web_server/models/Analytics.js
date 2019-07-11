var mongoose = require('mongoose');

var AnalyticsSchema = mongoose.Schema({
  sessionId: String,
  timestamp: String,
  eventType: String
})

module.exports = mongoose.model('Analytics', AnalyticsSchema);
