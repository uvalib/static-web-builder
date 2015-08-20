var GoogleSpreadsheet = require("google-spreadsheet"),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

if (!argv.f) {
  console.log( "You must specify the JSON file that you want to merge with the -f flag!" );
  process.exit()
}

fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data),
      my_sheet = new GoogleSpreadsheet('14OdpGWsoG6dQbiE5U9goxhOKh1oxovg1VA3_MkErOMw');
  my_sheet.getRows( 1, function(err, row_data){

      for (var i=0; i<row_data.length; i++) {
         var row = row_data[i];
          if (row.lastname)
              staff_dir.allMembers[ row.computingid ].sn = row.lastname;
          if (row.firstname)
              staff_dir.allMembers[ row.computingid ].givenName = row.firstname;
          if (row.nickname)
              staff_dir.allMembers[ row.computingid ].eduPersonNickname = row.nickname;
          if (row.phone)
              staff_dir.allMembers[ row.computingid ].telephoneNumber = row.phone;
          if (row.email)
              staff_dir.allMembers[ row.computingid ].mail = row.email;
          if (row.title)
              staff_dir.allMembers[ row.computingid ].title = row.title;
          if (row.officelocation)
              staff_dir.allMembers[ row.computingid ].physicalDeliveryOfficeName = row.officelocation;
          if (row.role)
              staff_dir.allMembers[ row.computingid ].role = row.role;
          if (row.profile)
              staff_dir.allMembers[ row.computingid ].profile = row.profile;
          if (row.imageurl)
              staff_dir.allMembers[ row.computingid ].imageurl = row.imageurl;
      }
      console.log( JSON.stringify(staff_dir) );
  });
});
