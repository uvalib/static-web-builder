var jsontr = require('./json-transform.js');

var items = require('./areas.json');
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
  field_assistant: {
    newName: "assistant",
    props: {target_uuid: {type: String, newName: "uuid"}}
  },
  field_mygroup: {
    newName: "mygroup",
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
