var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');

socket.on('new tweet', newTweet);

function newTweet(tweet) {
  var li = document.createElement('li');
  li.className = "message";
  li.innerHTML = '<strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text;

  tweetsHolder.appendChild(li);

  socket.emit('tweet', tweet);
}

socket.on('server-emit', function (data) {
  var msg = document.getElementById('msg');
  msg = data.current;
  msg.replace = data.current;
  socket.emit('client-emit', {});
});
