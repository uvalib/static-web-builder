var jsontr = require('./json-transform.js');

var items = require('./blocks.json');
var transform = {
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  info: {
    newName:'title',
    props: {value: String}
  },
  body: {
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
