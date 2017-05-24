var socket = io();

var tweetsHolder = document.querySelector('#tweetsHolder');

socket.on('new tweet', newTweet);

// Create tweet shell and print it to the page
function newTweet(tweet) {
  tweetsHolder.insertAdjacentHTML('afterbegin', '<li><strong>' + tweet.user.screen_name + '</strong>: ' + tweet.text + '</li>');
}

socket.on('update counter', function(counter) {
  var counterElement = document.querySelector('.counter')
  counterElement.innerHTML = 0;
  counterElement.innerHTML = counter;
});

socket.on('disconnect', function() {
  alert('De server is offline en het is niet gelukt om te verbinden met de server.');
});
