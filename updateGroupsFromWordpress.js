var fs = require('fs'),
    request = require('request-json'),
    argv = require('minimist')(process.argv.slice(2));

if (!argv.f) {
  console.log( "You must specify the JSON file that you want to merge with the -f flag!" );
  process.exit()
}

fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data);

  // Get Org descriptions from Wordpress and update the groups in the input JSON
  var client = request.createClient('http://godwit.lib.virginia.edu/');
  client.get('api/get_recent_posts/?dev=1&count=0&post_type=uvalib_organization', function(err, res, body){

      for (var i=0; i<body.posts.length; i++) {
        var post = body.posts[i];
        if (post.additional_info && post.additional_info.my_groups_id && staff_dir.allGroups[post.additional_info.my_groups_id] ) {
           staff_dir.allGroups[post.additional_info.my_groups_id].title = post.title; 
           staff_dir.allGroups[post.additional_info.my_groups_id].description = post.content; 
        }        
      }
      //console.log(staff_dir.allGroups.Library_Clemons); 
      //console.log(body.posts);
      console.log( JSON.stringify(staff_dir) );

  });  

});
