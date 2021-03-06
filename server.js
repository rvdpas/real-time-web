// require modules
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var Twitter = require('twitter');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

// configure dotenv
require('dotenv').config();

// create variable for user's input
var userInput = '';

// Set View Engine
app.set('view engine', 'ejs' );

// set dynamic files to public map
app.set('views', path.join(__dirname, 'views'));

// use body-parser for middle ware
app.use(bodyParser.urlencoded({ extended: false }));

// set static files to public map
app.use(express.static(path.join(__dirname, 'public')));

// Setting Twitter credentials
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Get search results
app.get('/', function(req, res){
  res.render('index.ejs');
});

// Get search results
app.get('/results', function(req, res){
  res.render('results.ejs');
});

// Post tweets to results page
app.post('/results', function(req, res){
  userInput = '';
  userInput = req.body.hash;

  // Request tweets based on the users input
  var stream = client.stream('statuses/filter', {track: userInput},  function(stream) {
    var counter = 0;
    res.render('results.ejs');

    // on every new tweet count + 1
    stream.on('data', function(tweet) {
     counter++;
     io.emit('new tweet', tweet);
     io.emit('update counter', counter);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });
});

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    io.emit('disconnect');
  });
});

server.listen(process.env.PORT || 8080, function() {
  console.log("Server started on port 8080...");
});
