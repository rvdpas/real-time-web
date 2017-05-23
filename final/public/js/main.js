var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');

socket.on('new tweet', newTweet);

function newTweet(tweet) {
  var li = document.createElement('li');
  li.className = "message";
  li.innerHTML = '<strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text;

  tweetsHolder.appendChild(li);
}

