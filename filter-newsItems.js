var jsontr = require('./json-transform.js'),
    request = require('request-promise'),
    items = require('./newsItems.json');

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
  created: {
    props: {value: Number}
  },
  changed: {
    props: {value: Number}
  },
  body: {
    props: {value: String}
  },
  field_link_to_item: {
    newName: "link",
    props: {uri: String}
  },
  field_source: {
    newName: "source",
    props: {value: String}
  },
  field_where_to_feature: {
    newName: "association",
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
