var mongoose = require('mongoose');

var AnalyticsSchema = mongoose.Schema({
  sessionId: String,
  events: [Object]
})

module.exports = mongoose.model('Analytics', AnalyticsSchema);
