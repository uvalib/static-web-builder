var jsontr = require('./json-transform.js');

var items = require('./services.json');
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
  body: {
    props: {value: String}
  },
  field_location: {
    newName: "library",
    props: {target_id:{newName:'id',type:Number},target_uuid:{newName:'uuid',type:String}}
  },
  field_service_email_address: {
    newName: "emailAddress",
    props: {value:String}
  },
  field_service_phone_number: {
    newName: "phoneNumber",
    props: {value:String}
  },
  field_site_link: {
    newName: "siteLink",
    props: {uri:String}
  },
  field_featured: {
    newName: "featured",
    props: {value:Number}
  },
  field_audience: {
    newName: "audience",
    props: {value:String}
  },
  field_owner_person: {
    newName: "owner",
    props: {"target_uuid":String}
  },
  field_owner_team: {
    newName: "team",
    props: {"target_uuid":String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
