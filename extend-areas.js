#!/usr/bin/env node
var fs = require('fs'),
    stdin = process.stdin,
    stdout = process.stdout,
    argv = require('minimist')(process.argv.slice(2));
    inputChunks = [];

if (!argv.f) {
  console.log( "You must specify the JSON file that you want to merge with the -f flag!" );
  process.exit()
}

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {
    var inputJSON = inputChunks.join(),
        areas = JSON.parse(inputJSON);

    // open extended data file
    fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){
      var staff_dir = JSON.parse(data);

      // for each area, look for mygroup, get listing
      areas.forEach(function(area){
        if (area.mygroup && staff_dir.allGroups[area.mygroup])
          area.groupMembers = staff_dir.allGroups[area.mygroup].members;
      });

      stdout.write(JSON.stringify(areas));
      stdout.write('\n');
    });
});
