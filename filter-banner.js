var _ = require('lodash');
var items = require('./banners.json');
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
  field_desktop_image: {
    newName: "desktopImage",
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_mobile_banner: {
    newName: "phoneImage",
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_tablet_image: {
    newName: "tabletImage",
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
      newProps[newPropName] = {};
      for (pkey in proptr.props) {
        newProps[newPropName] = Object.assign(newProps[newPropName], processProp(pkey, proptr.props[pkey], item[allowedPropName][0]) ); 
      } 
      if (Object.keys(proptr.props).length == 1) {
        newProps[newPropName] = _.values(newProps[newPropName])[0];
      }
    }
  }
  return newProps;
});

console.log(JSON.stringify(items));
