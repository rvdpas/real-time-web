var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');

socket.on('new tweet', newTweet);

function newTweet(tweet) {
  var li = document.createElement('li');
  li.className = "message";
  li.innerHTML = '<strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text;

  tweetsHolder.appendChild(li);
}

socket.on('server-emit', function (data) {
  var msg = document.getElementById('msg');
  msg = data.current;
  msg.replace = data.current;
  socket.emit('client-emit', {});
});

socket.on('update counter', function(counter) {
  var counterElement = document.querySelector('.counter')
  counterElement.innerHTML = 0;
  counterElement.innerHTML = counter;
});

socket.on('disconnect', function() {
  alert('De server is offline en het is niet gelukt om te verbinden met de server.');
});
