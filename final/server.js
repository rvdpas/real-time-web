var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var Twitter = require('twitter');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

var userInput = '';

require('dotenv').config();

// Set View Engine
app.set('view engine', 'ejs' );

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

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

app.post('/results', function(req, res){
  userInput = '';
  userInput = req.body.hash;
  console.log(userInput)

  var stream = client.stream('statuses/filter', {track: userInput},  function(stream) {

    res.render('results.ejs');

    stream.on('data', function(tweet) {
     io.emit('new tweet', tweet);
    });

    stream.on('error', function(error) {
      console.log(error);
    });
  });
});

server.listen(4000, function() {
	console.log("Server started on port 4000...");
});
