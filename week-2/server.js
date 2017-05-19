var express = require('express');
var path = require('path');
var app = express();
var Twitter = require('twitter');
var config = require('./config');
var bodyParser = require('body-parser');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connections = [];

server.listen(3000, function() {
	console.log("Server started on port 3000...");
});

app.set('view engine', 'ejs' );

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.post('/results', function(req, res, next){
  var userinput = req.body.handle;

  // Userinput from form will be put in the track
  var params = {track: userinput};
  // results will be stored in listOfResults
  var listOfResults = []

  // Open and manipulate data via a stream
  var stream = client.stream('statuses/filter', params);
  stream.on('data', function(data) {

    // Relevant content from API will put in a object
    var tweetObjects = {
      name: data.user.name,
      screen_name: data.user.screen_name,
      msg: data.text
    };

    // Push object in to array listOfResults
    listOfResults.push(tweetObjects);
    console.log(listOfResults)
    res.render('results.ejs', { tweets: listOfResults });

  });

  // If there is some error
  stream.on('error', function(error) {
    throw error;
  });
});

// io.sockets.on('connection', function(socket) {
//   connections.push(socket);
//   console.log('Connected: %s sockets connected', connections.length);

//   // Disconnect
//   socket.on('disconnect', function(data) {
//     users.splice(users.indexOf(socket.username), 1);
//     updateUsernames();

//     connections.splice(connections.indexOf(socket), 1);
//     console.log('Disconnected: %s sockets connected', connections.length);
//   });

//   // Send message
//   socket.on('send message', function(data) {
//     io.sockets.emit('new message', {
//       msg: data,
//       user: socket.username
//     });
//     console.log(data);
//   });


//   // New user
//   socket.on('new user', function(data, callback) {
//     callback(true);
//     socket.username = data;
//     users.push(socket.username);
//     updateUsernames();
//     console.log(socket.username);
//   });

//   // Update users
//   function updateUsernames() {
//     io.sockets.emit('get users', users);
//   };
// });
