/*eslint-env jquery*/
/*eslint-env browser*/
/*global timeago*/

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// using moment for unix to time since conversion
const timeSincePostedTweet = (data) => {
  let updatedTime = timeago.format(data.created_at);
  return updatedTime;
};

// function to make tweet input area safe from html attacks on the page
const safe = function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
  <span>${safe(timeSincePostedTweet(data))}</span>
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


// prepends an array of tweets to the tweetsContainer section in the main
const renderTweet = function(data) {
  for (let tweet of data) {
    $('#tweetsContainer').prepend(createTweetElement(tweet));
  }
};

//Ajax get request to get data json, then async pass it though renderTweet
const loadTweets = function() {
  $('#tweetsContainer').empty();
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log("your page is grabbing the tweets from database");
  
      //when we have the data from GET request, pass it through renderTweet
      renderTweet(tweets);
    })
    .catch((err) => {
      console.log("There was an ERROR ", err);
    });
};

///on submit callback function - handles ajax post requests on submit and form validation
const submitTweetPost = function(event) {
  event.preventDefault();
  console.log("form Submited")
  //form validation
  $('.errors').slideUp().text('');
  let formElement = $(this).parent().find('form');
  let input= formElement.find('textarea').val();
  //form validation
  console.log(formElement.serialize());
  
  
  if (!input) {
   $('.errors').text('Please enter a valid tweet').slideDown();
   return;
  } 
  if (input.length > 140) {
    return $('.errors').text('Your Tweet exceeds the maximum characters').slideDown();
  }
  
  // submitting tweets to database
  $.ajax('/tweets', {
    method: 'POST',
    data: formElement.serialize()
  })
    .then(function(tweet) {
    //dynamically render new tweets after post request
      loadTweets();
    })
    .catch((err) => {
      console.log('There was an error', err);
    });

  // clear the text area after
  $(this).children().find('textarea').val('');
  $('.counter').text(140); //reset the counter to 140 after successful tweet

};


//loads initial tweets on page load
loadTweets();


$(document).ready(function() {


  $('.tweetBottomside button').on('submit', submitTweetPost);

});
 