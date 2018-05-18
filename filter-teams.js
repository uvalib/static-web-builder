var jsontr = require('./json-transform.js'),
    ldap = require('ldapjs');

var groupClient = ldap.createClient({ url: 'ldap://pitchfork.itc.virginia.edu' });
var items = require('./teams.json');
var transform = {
  "@context": "http://schema.org",
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
  field_mygroup: {
    newName: "mygroup",
    props: {value: String}
  }
};

var items = jsontr.transform(items,transform);



console.log( JSON.stringify( items ) );
