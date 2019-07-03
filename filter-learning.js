var jsontr = require('./json-transform.js');

var items = require('./learning.json');
var transform = {
  uuid: {
    props: {value:String}
  },
  created: {
    props: {value:Number}
  },
  changed: {
    props: {value:Number}
  },
  sticky: {
    props: {value:Boolean}
  },
  promote: {
    props: {value:Boolean}
  },
  title: {
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_link_to_learning_item: {
    newName: "learningItemUrl",
    props: {uri:String}
  },
  field_source: {
    newName: "Source",
    props: {value:String}
  }
};

var json = JSON.stringify( jsontr.transform(items,transform) ).replace("drupal.lib.virginia.edu/sites/default","wwwstatic.lib.virginia.edu");
console.log( json );
