// Require dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var http = require('http');
var fs = require('fs');

var orders = require('./routes/orders');
var drinks = require('./routes/drinks');
var machines = require('./routes/machines');
var users = require('./routes/users');
var analytics = require('./routes/analytics');

// Declare application parameters
var HTTP_PORT = 8080;

// Configure
require('./config/configuration.js')(app, mongoose);

// Models
Orders = require('./models/Orders.js');
Drinks = require('./models/Drinks.js');
Machines = require('./models/Machines.js');
Users = require('./models/Users.js');
Analytics = require('./models/Analytics.js');

// Routes
app.use('/orders', orders);
app.use('/drinks', drinks);
app.use('/machines', machines);
app.use('/users', users);
app.use('/analytics', analytics);

// Server
var httpServer = http.createServer(app);

httpServer.listen(HTTP_PORT, function() {
  console.log('[Express.js] Server listening on PORT: '+ HTTP_PORT);
});
