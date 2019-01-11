var jsontr = require('./json-transform.js');

var items = require('./teams.json');
var transform = {
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  changed: {
    props: {value:Number}
  },
  title: {
    newName: "title",
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_manager: {
    newName: "manager",
    props: {target_uuid: {type: String, newName: "uuid"}}
  },
  field_area_team: {
    newName: "area",
    props: {target_uuid: {type: String, newName: "uuid"}}
  },
  field_parent_team: {
    newName: "parentTeam",
    props: {target_uuid: {type: String, newName: "uuid"}}
  },
  field_members: {
    newName: "members",
    props: {target_uuid: {type: String, newName: "uuid"}}
  }
};

var items = jsontr.transform(items,transform);
var rp = require('request-promise');
var getuserids = async function(){
  var u = await rp({uri:'https://uvalib-api.firebaseio.com/people.json',json:true});
  var mapping = u.reduce((map,obj)=>{
    map[obj.uuid] = obj.computingId;
    return map
  },{});
  items.forEach(i=>{
    if (i.members && Array.isArray(i.members)) {
      i.members = i.members.map(j=>mapping[j.uuid])
    }
  });
}

getuserids().then(function(){
  console.log( JSON.stringify( items ) );
});
