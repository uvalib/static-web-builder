var jsontr = require('./json-transform.js');

var items = require('./libraries.json');
var placeTypes = require('./placeTypes.json');

// Discard most of the taxonomy place types information as we just need the uuid and string value
var transformPlaceTypes = {
  uuid: {
    props: {value:String}
  },
  name: {
    props: {value:String}
  }
};

placeTypes = jsontr.transform(placeTypes,transformPlaceTypes);

// Transform this simplified place type objects array into a lookup table.
var libraryTypes = Array();
for (var i=0; i<placeTypes.length; i++) {
  libraryTypes[placeTypes[i].uuid] = placeTypes[i].name;
}

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
  field_short_title: {
    newName: "shortTitle",
    props: {value:String}
  },
  field_type: {
    newName: "placeType",
    props: {target_type:{type:String, newName:"name"}, target_uuid:{type:String, newName:'uuid'}}
  },
  field_contact_form: {
    newName: "contactForm",
    props: {uri:String}
  },
  field_donor_description: {
    newName: "donorDescription",
    props: {value:String}
  },
  field_donor_title: {
    newName: "donorTitle",
    props: {value:String}
  },
  field_email_address: {
    newName: "emailAddress",
    props: {value:String}
  },
  field_hours_information: {
    newName: "hoursInformation",
    props: {value:String}
  },
  field_libcal_id: {
    newName: "libcalID",
    props: {value:String}
  },
  field_library_feed: {
    newName: "libraryFeed",
    props: {uri:String}
  },
  field_library_site_link: {
    newname: "siteLink",
    props: {uri:String}
  },
  field_main_image: {
    newName: "mainImage",
    props: {alt:String, url:String, target_uuid:{type:String, newName:'uuid'}}
  },
  field_facilities_management_key: {
    newName: "fmKey",
    props: {value:String}
  },
  field_fm_location: {
    newName: "location",
    props: {lat:String, lng:String}
  },
  field_mygroup_id: {
    newName: "mygroupID",
    props: {value:String}
  },
  field_phone_number: {
    newName: "phoneNumber",
    props: {value:String}
  },
  field_short_title: {
    newName: "shortTitle",
    props: {value:String}
  },
  field_social_media: {
    newName: "socialMedia",
    props: {uri:String,title:String}
  },
  field_slug: {
    newName: "slug",
    props: {value:String}
  },
  field_zip_code: {
    newName: "zipCode",
    props: {value:String}
  }
};

items = jsontr.transform(items,transform);

// Loop through libraries and update the name for the place type to lookup the UUID and get the corresponding value
for (var i=0; i<items.length; i++) {
  var library = items[i];
  for (prop in library) {
    if (prop == "placeType") {
      items[i][prop].name = libraryTypes[library[prop].uuid];
    }
  }
  if (library.shortTitle.length == 0 || !library.shortTitle) items[i].shortTitle = library.title;
}

//console.log(items);
console.log(JSON.stringify(items));
