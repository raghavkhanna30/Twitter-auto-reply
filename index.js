const Twitter = require("twitter-lite/twitter");
const config = require("./config");
const motivationalReplies = require("./motivationalReplies");

const client = new Twitter({
  subdomain: config.subdomain,
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

const getReplyWithUsername = (username, reply) => {
  return reply.replace(/###/g, `@${username}`);
};

const replyToTweet = tweet => { 
  const tweet_id = tweet.id_str;
  const username = tweet.user.screen_name;
  const reply =
    motivationalReplies[Math.floor(Math.random() * motivationalReplies.length)];
  client
    .post("statuses/update", {
      in_reply_to_status_id: tweet_id,
      status: getReplyWithUsername(username, reply),
      auto_populate_reply_metadata: true
    })
    .then(() => console.log(`Replied to ${tweet.id}`))
    .catch(error => console.log("error", error));
};

setInterval(() => {
  const tweet = client.get("search/tweets", { q: "#YOUR_HASHTAG -filter:retweets AND -filter:replies", count: "1" })
    .then(tweet => replyToTweet(tweet.statuses[0]))
}, 300000);
