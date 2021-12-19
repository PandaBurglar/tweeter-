/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// using moment for unix to time since conversion
const timeSincePostedTweet = (unix) => {
  let updatedTime = moment(unix).fromNow();
  return updatedTime;
};

// function to make tweet input area safe from html attacks on the page
const safe = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//turns tweet objects into HTML formatted tweet articles
const createTweetElement = function(data) {
  let $tweet = $(`
  <article class="tweet">
  <header>
    <div class="user">
      <img
        src="${safe(data.user.avatars)}"
        alt="">
      <p>${safe(data.user.name)}</p>
    </div>
    <h4>${safe(data.user.handle)}</h4>
  </header>
  <p>${safe(data.content.text)}</p>
  <footer>
  <span>${safe(timeSincePostedTweet(data.created_at))}</span>
    <div>
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
    </div>
  </footer>
</article>
  `);
  return $tweet;
};


// appends an array of tweets to the tweetsContainer section in the main
const renderTweet = function(data) {
  $('#tweetsContainer').empty();
  for (let tweet of data) {
    $('#tweetsContainer').prepend(createTweetElement(tweet));
  }
};

const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log("your page is grabbing the tweets from database")
  
      //when we have the data from GET request, pass it through renderTweet
      renderTweet(tweets)
    })
    .catch((err) => {
      console.log("There was an ERROR ", err)
    })
};

//loads all tweets on page load
loadTweets()

// submit tweets via post request to /tweets
$(document).ready(function() {

  $('.errors').slideUp(400).text('');

  $('form.submitATweet').on('submit', function(event) {
    event.preventDefault();
    
    if (!$(this).children().find('textarea').val()) {
      return $('.errors').text('Please enter a valid tweet').slideDown();
    }
    if ($(this).children().find('textarea').val().length > 140) {
      return $('.errors').text('Your Tweet exceeds the maximum characters').slideDown();
    }


    console.log('tweet submitted, sending to database');
    $.ajax('/tweets', {
      method: 'POST',
      data: $(this).serialize()
    })
      .then(function(tweet) {
        loadTweets();
      })
      .catch((err) => {
        console.log('There was an error', err)
      })
      $(this).children().find('textarea').val('');
  });

}); 

 