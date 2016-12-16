var _ = require('lodash');
var items = require('./libraries.json');
var transform = {
  nid: {
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  vid: {
    props: {value:String}
  },
  title: {
    props: {value: String}
  },
  body: {
    props: {value: String}
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
    props: {alt:String, width:Number, height:Number, url:String, target_uuid:{type:String, newName:'uuid'}}
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
  field_zip_code: {
    newName: "zipCode",
    props: {value:String}
  }
}; 

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
 
items = _.map(items, function(item){
  newProps = {};
  for (allowedPropName in transform) {
    if (item.hasOwnProperty(allowedPropName)) {
      var proptr = transform[allowedPropName];
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
        // If only one property just use the value insead of the whole object
        if (Object.keys(proptr.props).length == 1) {
          newProps[newPropName] = _.values(newProps[newPropName])[0];
        }
      }
    }
  }
  return newProps;
});

//console.log(items);
console.log(JSON.stringify(items));
