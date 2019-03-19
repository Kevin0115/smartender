// Require dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var orders = require('./routes/orders');
var drinks = require('./routes/drinks');

// Declare application parameters
var PORT = process.env.PORT || 80;

// Configure
require('./config/configuration.js')(app, mongoose);

// Models
Orders = require('./models/Orders.js');
Drinks = require('./models/Drinks.js');

// Routes
app.use('/orders', orders);
app.use('/drinks', drinks);

// Server
app.listen(PORT, function(){
  console.log('[Express.js] Server listening on PORT: '+ PORT);
});