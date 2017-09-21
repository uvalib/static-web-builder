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
        teams = JSON.parse(inputJSON);

    // open extended data file
    fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){
      var staff_dir = JSON.parse(data);

      // for each team, look for mygroup, get listing
      teams.forEach(function(team){
        if (team.mygroup && staff_dir.allGroups[team.mygroup])
          team.groupMembers = staff_dir.allGroups[team.mygroup].members;
      });

      stdout.write(JSON.stringify(teams));
      stdout.write('\n');
    });
});
