/**
 * Aggregate feeds from social media channels.
 *
 * @param  {Object} sources 
 * @param  {Function} callback 
 */
module.exports = {
  aggregate: function(sources, callback){
    getFacebookSource(sources, callback);
  }
};

var graph = require('fbgraph'),
    Twit = require('twit'),
    RSS = require('rss'),
    moment = require('moment');

graph.setVersion("2.3");

var feed = new RSS({
  title: "Aggregated Library Social Feed",
  pubDate: Date.now()
});
var items = [];

var getFacebookSource = function(sources, callback){
  if (sources.facebook && sources.facebook.accessToken && sources.facebook.paths.length > 0) {
    graph.setAccessToken(sources.facebook.accessToken);
    var path = sources.facebook.paths.shift();
    graph.get(path,function(err,res){
      if (res.data && res.data.length) {
      for (var i=0; i<res.data.length; i++) {
        var item = res.data[i];
        if (!item.is_hidden && !item.is_expired) {
          items.push({
            title:(item.story)?
                    item.story:
                    (item.name)?
                      item.from.name+" shared "+item.name:
                      (item.status_type=="added_video")?
                        item.from.name+" shared a video on Facebook":
                        item.from.name+" shared on Facebook",
            description:((item.message)? item.message.parseURL().parseUsername().parseHashtag() +"<br />":"") +
                        ((item.description)? item.description.parseURL().parseUsername().parseHashtag() :""),
            url:(item.link)? item.link: null,
            categories:['facebook',item.type],
            author:"https://www.facebook.com/"+item.from.id+"/",
            date:moment(item.created_time,"YYYY-MM-DDTHH:mm:ssZZ"),
//            lat:0,
//            long:0,
            custom_elements:[
              {'source':[{_attr:{url: ""}},
                         "facebook"]}
            ],
            enclosure:(item.picture)?
                        {url:item.picture}:
                        {}
          });
        }
      }
      }
      getFacebookSource(sources, callback);
    });
  } else {
    getTwitterSource(sources, callback);
  }
};

var getTwitterSource = function(sources, callback){ 
  if (sources.twitter && sources.twitter.consumerKey && sources.twitter.consumerSecret && sources.twitter.accessToken && sources.twitter.accessTokenSecret && sources.twitter.users.length >0) {
    var T = new Twit({consumer_key: sources.twitter.consumerKey,
                      consumer_secret: sources.twitter.consumerSecret,
                      access_token: sources.twitter.accessToken,
                      access_token_secret: sources.twitter.accessTokenSecret});
    var user = sources.twitter.users.shift();
    T.get('statuses/user_timeline',{screen_name:user}, function(err, data, response){
      for (var i=0; i<data.length; i++) {
        var item = data[i];
        if (!item.in_reply_to_status_id && !item.possibly_sensitive) {
          items.push({
              title:item.user.screen_name+" tweeted",
              description: item.text.parseURL().parseUsername().parseHashtag() ,
              url:"https://twitter.com/"+item.user.screen_name+"/status/"+item.id_str,
              categories:item.entities.hashtags,
              author:"http://twiter.com/"+item.user.screen_name,
              date:moment(item.created_at,"ddd MMM DD HH:mm:ss Z YYYY"),
//            lat:0,
//            long:0,
              custom_elements:[
              {'source':[{_attr:{url: ""}},
                         "twitter"]}
              ],
              enclosure:{}
          });
        }
      }
      getTwitterSource(sources, callback);
    });
  } else {
    getRssSource(sources, callback);
  }
};

var getRssSource = function(sources, callback){
  items.sort( function(a,b){ return (a.date.isBefore(b.date))?1:-1 } );
  feed.items = items;
  callback( feed.xml() ); 
};

String.prototype.parseURL = function() {
	return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return url.link(url);
	});
};

String.prototype.parseUsername = function() {
	return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return u.link("http://twitter.com/"+username);
	});
};

String.prototype.parseHashtag = function() {
	return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
		var tag = t.replace("#","%23")
		return t.link("http://search.twitter.com/search?q="+tag);
	});
};
