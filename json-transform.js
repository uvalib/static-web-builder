var exports = module.exports = {},
    _ = require('lodash');

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
    var tmp = {};
    tmp[key]=trDef; 
    return tmp;
  }
};

exports.transform = function(items,transform){
  return _.map(items, function(item){
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
               } else if (!transform[allowedPropName].props) {
                   // Extra properties that doesn't have a props value are copied
                   newProps[allowedPropName] = transform[allowedPropName];
               }               
             }
             return newProps;
           });
};
