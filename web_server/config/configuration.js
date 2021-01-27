var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var STATIC_ROOT = path.resolve(__dirname, '../public');

module.exports = function(app, mongoose){
  app.set('db', 'mongodb+srv://kevin:smartender@smartender.0ttoe.mongodb.net/smartender?retryWrites=true&w=majority');

  // Defining CORS middleware to enable CORS.
  function cors(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS,PUT");
    next();
  }

  // Configure the app to use a bunch of middlewares
  app.use(express.json());							// handles JSON payload
  app.use(express.urlencoded({ extended : true }));	// handles URL encoded payload
  app.use(cors);										// Enable CORS
  app.use(bodyParser.urlencoded({extended: true}))
  app.use('/', express.static(STATIC_ROOT));			// Serve STATIC_ROOT at URL "/" as a static resource

  mongoose.connect(app.get('db'), { useNewUrlParser: true });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Database Connection Error:'));
  db.once('open', function callback(){
      console.log('MongoDB Connected');
  });
};