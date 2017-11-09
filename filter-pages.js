var jsontr = require('./json-transform.js');

var items = require('./pages.json');
var transform = {
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  title: {
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_parent_page: {
    props: {target_id:{newName:'id',type:Number},target_uuid:{newName:'uuid',type:String}}
  },
  field_path: {
    newName: "path",
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
