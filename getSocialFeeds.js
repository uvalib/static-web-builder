var agg = require('social-aggregate')

var sources = {
  facebook: {accessToken: process.env.FACEBOOK_APP_ID+"|"+process.env.FACEBOOK_APP_SECRET,
             paths: ['/136530559704906/feed']}, 
  twitter:  {consumerKey: process.env.TWITTER_CONSUMER_KEY,
             consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
             accessToken: process.env.TWITTER_ACCESS_TOKEN,
             accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
             users: ["uvalibrary","uvaits","uvajobs"]},
  rss: {}
};

agg.aggregate(sources, function(rss){
  console.log(rss);
});

