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
  field_date: {
    newName: "date",
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
  field_main_exhibit: {
    newName: "mainExhibit",
    props: {value: Boolean}
  },
  field_exhibition_status_type: {
    newName: "exhibitStatus",
    props: {value: String}
  },
  field_further_location_informati: {
    newName: "furtherLocInfo",
    props: {value:String}
  },
  field_library: {
    newName: "library",
    props: {target_uuid:String}
  },
  field_link_to_exhibit_informatio: {
    newName: "link",
    props: {value: String}
  },
  field_location_url: {
    newName: "locationURL",
    props: {value:String}
  }
};

var json = JSON.stringify( jsontr.transform(items,transform) ).replace("drupal.lib.virginia.edu/sites/default","wwwstatic.lib.virginia.edu");
console.log( json );
