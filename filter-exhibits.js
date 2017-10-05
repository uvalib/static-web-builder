var jsontr = require('./json-transform.js');

var items = require('./exhibits.json');
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
  title: {
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_end_date: {
    newName: "endDate",
    props: {value: String}
  },
  field_image: {
    newName: "image",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_exhibit_status_foo: {
    newName: "exhibitStatus",
    props: {value: String}
  },
  field_library: {
    newName: "library",
    props: {target_uuid:String}
  },
  field_link_to_exhibit_informatio: {
    newName: "link",
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
