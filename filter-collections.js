var jsontr = require('./json-transform.js');

var items = require('./collections.json');
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
  field_collection_info_url_: {
    newName: "collectionURL",
    props: {value:String}
  },
  field_col_type: {
    newName: "collectionType",
    props: {value:String}
  }
};

var json = JSON.stringify( jsontr.transform(items,transform) ).replace("drupal.lib.virginia.edu/sites/default","wwwstatic.lib.virginia.edu");
console.log( json );
