var exec = require('child_process').exec,
    pageList = require('./pages.json'),
    _ = require('lodash'),
    i = 0,
    allForms = Array();

var formList = _.filter(pageList, function(obj) { return obj.field_webform.length > 0;});

// See https://stackoverflow.com/questions/35055731/how-to-deeply-map-object-keys-with-javascript-lodash
// for use of mixin to add this deep mapping solution to remove # from keys to get past Firebase issue
_.mixin({
    deep: function (obj, mapper) {
        return mapper(_.mapValues(obj, function (v) {
            return _.isPlainObject(v) ? _.deep(v, mapper) : v;
        }));
    },
});

function gatherForms() {
  if (i < formList.length) {
    if (formList[i].field_webform.length > 0) {
      var form = {
        title: formList[i].title[0].value,
        path: formList[i].field_path[0].value,
        target_id: formList[i].field_webform[0].target_id
      }
      var cmd = 'wget http://drupal.lib.virginia.edu/webform_rest/'+formList[i].field_webform[0].target_id+'/elements?_format=json -O frmDetail'+formList[i].field_webform[0].target_id+'.json'
      exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        } else {
          var webform = require('./frmDetail'+form.target_id+'.json');
          form['webform'] = _.deep(webform, function(x) {
              return _.mapKeys(x, function (val, key) {
                return key.replace('#','');
              });
          });
          allForms[i] = form;
          i++;
          gatherForms();
        }
      });
    }
  } else {
    console.log(JSON.stringify(allForms));
  }
}

gatherForms();
