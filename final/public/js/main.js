var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');


function newTweet(tweet) {
  var li = document.createElement('li');
  li.className = "message";
  li.innerHTML = '<strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text;

  tweetsHolder.appendChild(li);
  console.log(tweet);

  msg.innerHTML = tweet.length;

  socket.emit('tweet', tweet);
}

socket.on('update counter', function(counter) {
    // LET OP: 'pseudo code'
    var counterElement = document.querySelector('.counter-element')
    counterElement.innerHTML = counter;
});
