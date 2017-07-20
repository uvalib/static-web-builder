var jsontr = require('./json-transform.js');

var items = require('./destinations.json');
var transform = {
  "@context": "http://schema.org",
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
  field_library: {
    newName: "library",
    props: {target_id:{newName:'id',type:Number},target_uuid:{newName:'uuid',type:String}}
  },
  field_area: {
    newName: "area",
    props: {value:String}
  },
  field_callnumber_end: {
    newName: "callEnd",
    props: {value:String}
  },
  field_callnumber_start: {
    newName: "callStart",
    props: {value:String}
  },
  field_callnumber_key: {
    newName: "callKey",
    props: {value:String}
  },
  field_directions: {
    newName: "directions",
    props: {value:String}
  },
  field_floor: {
    newName: "floor",
    props: {value:String}
  },
  field_format_key: {
    newName: "formatKey",
    props: {value:String}
  },
  field_location_key: {
    newName: "locationKey",
    props: {value:String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
