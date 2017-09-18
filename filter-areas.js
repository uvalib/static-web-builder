var jsontr = require('./json-transform.js');

var items = require('./areas.json');
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
    newName: "fullName",
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_mygroup: {
    newName: "mygroup",
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
