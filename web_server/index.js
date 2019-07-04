// Require dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var https = require('https');
var fs = require('fs');
var options = {
  key: fs.readFileSync('./privatekey.pem'),
  cert: fs.readFileSync('./server.crt')
};

var orders = require('./routes/orders');
var drinks = require('./routes/drinks');
var machines = require('./routes/machines');
var users = require('./routes/users');
var analytics = require('./routes/analytics');

// Declare application parameters
var HTTPS_PORT = 443;

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
var httpsServer = https.createServer(options, app);

httpsServer.listen(HTTPS_PORT, function() {
  console.log('[Express.js] Server listening on PORT: '+ HTTPS_PORT);
});
