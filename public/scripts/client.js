/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// appends an array of  tweets to the tweetsContainer section in the main
const renderTweet = function(data) {
  for (let tweet of data) {
    let tweetTemp = createTweetElement(tweet);
    $('#tweetsContainer').append(createTweetElement(tweet));
  }
}

const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET' })
    .then((tweets) => {
      console.log(tweets)
      return tweets;
      //when we have the data from GET request, pass it through renderTweet
      renderTweet(tweets);
    })
    .catch((err) => {
      console.log("There was an ERROR ", err)
    })
};

loadTweets()

// submit tweets via post request to /tweets
$(document).ready(function() {

  $('form.submitATweet').on('submit', function(event) {
    event.preventDefault();
    
    if (!$('#tweet-text').val()) {
      return alert('You cannot post an empty tweet')
    }
    if ($('#tweet-text').val().length > 140) {
      return alert("Your tweet exceeds the maximum characters")
    }


    console.log('tweet submitted, sending to database');
    $.ajax('/tweets', {
      method: 'POST',
      data: $(this).serialize()
    })
      .then(function(tweet) {
        console.log('Tweet has successfully been sent to database');
        $('#tweet-text').val('')
        loadTweets()
      })
      .catch((err) => {
        console.log('There was an error', err)
      })
  });
}); 

 