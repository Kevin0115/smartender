// Require dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var https = require('https');
var http = require('http');
var fs = require('fs');
var privateKey  = fs.readFileSync('./ssl/server.key', 'utf8');
var certificate = fs.readFileSync('./ssl/server.cert', 'utf8');

var orders = require('./routes/orders');
var drinks = require('./routes/drinks');
var machines = require('./routes/machines');

// Declare application parameters
var HTTP_PORT = 80;
var HTTPS_PORT = 443;
var credentials = {key: privateKey, cert: certificate};

// Configure
require('./config/configuration.js')(app, mongoose);

// Models
Orders = require('./models/Orders.js');
Drinks = require('./models/Drinks.js');
Machines = require('./models/Machines.js');

// Routes
app.use('/orders', orders);
app.use('/drinks', drinks);
app.use('/machines', machines);

// Server
// app.listen(PORT, function(){
//   console.log('[Express.js] Server listening on PORT: '+ PORT);
// });

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(HTTP_PORT, function() {
  console.log('[Express.js] Server listening on PORT: '+ HTTP_PORT);
});
httpsServer.listen(HTTPS_PORT, function() {
  console.log('[Express.js] Server listening on PORT: '+ HTTPS_PORT);
});