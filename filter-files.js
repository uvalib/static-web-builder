var jsontr = require('./json-transform.js');

var items = require('./files.json');
var transform = {
  uuid: {
    props: {value:String}
  },
  filename: {
    props: {value:String}
  },
  uri: {
    props: {value:String}
  },
  filemime: {
    props: {value:String}
  },
  filesize: {
    props: {value:String}
  },
  created: {
    props: {value:Number}
  },
  changed: {
    props: {value:Number}
  }
};

var json = JSON.stringify( jsontr.transform(items,transform) );
console.log( json );
