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
  info: {
    props: {newName:'title', value: String}
  },
  body: {
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
