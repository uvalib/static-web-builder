var _ = require('lodash');
var items = require('./forms.json');
var transform = {
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  title: {
    props: {value:String}
  },
  body: {
    props: {value:String}
  },
  field_anonymous: {
    newName: "anonymous",
    props: {value:Boolean}
  },
  field_auto_: {
    newName: "autoRespond",
    props: {value:String}
  },
  field_message: {
    newName: "message",
    props: {value:String}
  },
  field_recipients: {
    newName: "recipients",
    props: {value:String}
  },
  field_redirect_path: {
    newName: "redirectPath",
    props: {value:String}
  },
  field_require_authentication: {
    newName: "requireAuthentication",
    props: {value:Boolean}
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