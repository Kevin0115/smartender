// Require dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var clinics = require('./routes/clinics');

// Declare application parameters
var PORT = process.env.PORT || 80;

// Configure
require('./config/configuration.js')(app, mongoose);

// Models
Clinics = require('./models/Clinics.js');

// Routes
app.use('/clinics', clinics);

// Server
app.listen(PORT, function(){
  console.log('[Express.js] Server listening on PORT: '+ PORT);
});