$(document).ready(function() {
  console.log('doc is ready');

  $('form.submitATweet').on('submit', submitTweetPost)

  $('.writeATweet').on('click', function() {
    $('.new-tweet').slideToggle(200);
  });

});