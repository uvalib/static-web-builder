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
           staff_dir.allGroups[post.additional_info.my_groups_id].wordpressId = post.id; 
           staff_dir.allGroups[post.additional_info.my_groups_id].title = post.title; 
           staff_dir.allGroups[post.additional_info.my_groups_id].description = post.content; 
           staff_dir.allGroups[post.additional_info.my_groups_id].contactName = post.additional_info.contact_name; 
           staff_dir.allGroups[post.additional_info.my_groups_id].contactEmail = post.additional_info.email_address; 
           staff_dir.allGroups[post.additional_info.my_groups_id].children = post.children; 
        }        
      }
      // tell children groups about their parents
      for (var i=0; i<body.posts.length; i++) {
        var post = body.posts[i];
        if (post.children) {
          var parent = post.id;
          for (var j=0; j<post.children; j++) {
            var child = post.children[j];
            for (groupid in staff_dir.allGroups) {
              if (staff_dir.allGroups.wordpressId == child) staff_dir.allGroups[groupid].parent = parent; 
            }
          }
        } 
      }
      console.log( JSON.stringify(staff_dir) );
  });  
});
