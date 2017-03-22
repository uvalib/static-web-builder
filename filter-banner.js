var _ = require('lodash');
var items = require('./banners.json');
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
  field_display_title: {
    newName: "displayTitle",
    props: {value: Boolean}
  },
  field_shady_desktop: {
    newName: "shadyDesktop",
    props: {value: Boolean}
  },
  field_shady_tablet: {
    newName: "shadyTablet",
    props: {value: Boolean}
  },
  field_shady_mobile: {
    newName: "shadyMobile",
    props: {value: Boolean}
  },
  sticky: {
    props: {value: Boolean}
  },
  field_action_link: {
    newName: "link",
    props: {uri:String}
  },
  field_button_text: {
    newName: "buttonText",
    props: {value:String}
  },
  field_tone: {
    newName: "tone",
    props: {value:String}
  },
  field_desktop_image: {
    newName: "desktopImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_mobile_banner: {
    newName: "phoneImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_tablet_image: {
    newName: "tabletImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
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
