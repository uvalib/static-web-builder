var GoogleSpreadsheet = require("google-spreadsheet"),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

if (!argv.f) {
  console.log( "You must specify the JSON file that you want to merge with the -f flag!" );
  process.exit()
}

fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data),
  my_sheet = new GoogleSpreadsheet('1GRi541uPprWN0AY7WPvkOIqR68RcE6fbWp1s5q1uXlA');
  my_sheet.getRows( 1, function(err, row_data){

//console.log(row_data);
      for (var i=0; i<row_data.length; i++) {
         var row = row_data[i];
         if(staff_dir.allMembers.hasOwnProperty(row.computingid)) staff_dir.allMembers[ row.computingid ]['override'] = row;
      }
      console.log( JSON.stringify(staff_dir) );
  });
});
