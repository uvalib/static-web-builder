var _ = require('lodash');
var items = require('./libraries.json');
var placeTypes = require('./placeTypes.json');
var processProp = function(key, trDef, prop){
  var type = trDef.type || trDef;
  var newKey = trDef.newName || key;
  if (!prop) {
    return {};
  } else if (type == String) {
    return {[newKey]:prop[key]};
  } else if (type == Boolean) {
    return {[newKey]:(prop[key]=="0")?false:true};
  } else if (type == Number) {
    return {[newKey]:Number(prop[key])};
  } else {
    return {};
  }
};

// Discard most of the taxonomy place types information as we just need the uuid and string value
var transformPlaceTypes = {
  uuid: {
    props: {value:String}
  },
  name: {
    props: {value:String}
  }
};
placeTypes = _.map(placeTypes, function(item){
  newProps = {};
  for (allowedPropName in transformPlaceTypes) {
    if (item.hasOwnProperty(allowedPropName)) {
      var proptr = transformPlaceTypes[allowedPropName];
      newPropName = proptr['newName'] || allowedPropName;
      newProps[newPropName] = []
      for (i=0; i<item[allowedPropName].length; i++) {
        newProps[newPropName][i] = {};
        for (pkey in proptr.props) {
          newProps[newPropName][i] = Object.assign(newProps[newPropName][i], processProp(pkey, proptr.props[pkey], item[allowedPropName][i]) );
        }
      }
      if (newProps[newPropName].length == 1) {
        newProps[newPropName] = newProps[newPropName][0];
        // If only one property just use the value instead of the whole object
        if (Object.keys(proptr.props).length == 1) {
          newProps[newPropName] = _.values(newProps[newPropName])[0];
        }
      }
    }
  }
  return newProps;
});
// Transform this simplified place type objects array into a lookup table.
var libraryTypes = Array();
for (var i=0; i<placeTypes.length; i++) {
  libraryTypes[placeTypes[i].uuid] = placeTypes[i].name;
}

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
  body: {
    props: {value: String}
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
  field_hours_information {
    newName: "hoursInfo",
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
    props: {alt:String, target_uuid:{type:String, newName:'uuid'}}
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

items = _.map(items, function(item){
  newProps = {};
  for (allowedPropName in transform) {
    if (item.hasOwnProperty(allowedPropName)) {
      var proptr = transform[allowedPropName];
      newPropName = proptr['newName'] || allowedPropName; 
      newProps[newPropName] = [];
      for (i=0; i<item[allowedPropName].length; i++) {
        newProps[newPropName][i] = {};
        for (pkey in proptr.props) {
          newProps[newPropName][i] = Object.assign(newProps[newPropName][i], processProp(pkey, proptr.props[pkey], item[allowedPropName][i]) ); 
        } 
      }
      if (newProps[newPropName].length == 1) {
        newProps[newPropName] = newProps[newPropName][0];
        // If only one property just use the value instead of the whole object
        if (Object.keys(proptr.props).length == 1) {
          newProps[newPropName] = _.values(newProps[newPropName])[0];
        }
      }
    }
  }
  return newProps;
});

// Loop through libraries and update the name for the place type to lookup the UUID and get the corresponding value
for (var i=0; i<items.length; i++) {
  for (prop in items[i]) {
    if (prop == "placeType") {
      items[i][prop].name = libraryTypes[items[i][prop].uuid];
    }
  }
}

//console.log(items);
console.log(JSON.stringify(items));

