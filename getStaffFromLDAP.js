var ldap = require('ldapjs'),
    q = require('q'),
    assert = require('assert');

var directory = {allMembers:{},
                 allGroups:{}},
    uids = [];

var groupClient = ldap.createClient({ url: 'ldap://pitchfork.itc.virginia.edu' }),
    userClient = ldap.createClient({ url: 'ldap://ldap.virginia.edu'});

// find all the non-private groups that start with Library_
groupClient.bind(process.env.MYGROUP_USER,process.env.MYGROUP_PASSWORD,function(err) {
  assert.ifError(err);
  var opts = {
    filter: "(&(cn=Library_*)(!(uvaPrivateGroup=yes)))",
    attributes: ['cn','memberUid'],
    scope: 'sub'
  };
  groupClient.search("ou=Groups,o=University of Virginia,c=US", opts, function(err,res){
    assert.ifError(err);
    res.on('searchEntry', function(entry){
      processGroup(entry.object);
    });
    res.on('end', function(result){
      // Give the last Group a sec to process
      setTimeout(harvestUsers,1000);
    });
  });
});

var processGroup = function(group) {
  if (group.memberUid) {
    var members = (typeof group.memberUid === 'string')? [group.memberUid]:group.memberUid;
    members.forEach(function(uid){ uids.push(uid); });
    directory.allGroups[group.cn] = {members: members };
  }
};

var harvestUsers = function(index) {

  if (!index) index=0;
  if (index < uids.length)
    getUser(uids[index]).then(function(){ harvestUsers(index+1); });
  else {
    console.log( JSON.stringify(directory) );
    process.exit();
  }
}

var getUser = function(uid) {
  var deferred = q.defer(),
      opts = {
        filter: "uid="+uid,
        attributes: ['cn','sn','givenName','initials','displayName','title','uid','mail','telephoneNumber','physicalDeliveryOfficeName','labeledUri','OfficeFax','homePhone','eduPersonNickname'],
        scope: 'sub'
      };
  userClient.search("o=University of Virginia,c=US",opts,function(err,res){
    assert.ifError(err);
    res.on('searchEntry', function(entry){
      directory.allMembers[uid]=entry.object;
    });
    res.on('end', function(result){
      deferred.resolve('done');
    });
  });
  return deferred.promise;
};
