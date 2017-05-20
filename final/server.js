var path = require('path');
var http = require('http');
var express = require('express');
var Twitter = require('twitter');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

users = [];
connections = [];

require('dotenv').config();

app.set('view engine', 'ejs' );

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){

  client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
   console.log(tweets);
  res.render('index.ejs', {data: tweets});
  });

});

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response) {
   console.log(tweets);
});


io.sockets.on('connection', function(socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(data) {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();

    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  // Send message
  socket.on('send message', function(data) {
    io.sockets.emit('new message', {
      msg: data,
      user: socket.username
    });
    console.log(data);
  });

  // New user
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.username = data;

    if (users.indexOf(socket.username) === -1) {
      users.push(socket.username);
      console.log('new users is : ' + socket.username);
    } else {
      console.log(socket.username + ' This username is already taken');
    };
    updateUsernames();
    console.log(socket.username);
  });

  // Update users
  function updateUsernames() {
    io.sockets.emit('get users', users);
  };
});

server.listen(3000, function() {
	console.log("Server started on port 3000...");
});
