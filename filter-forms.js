var exec = require('child_process').exec;
var formList = require('./forms.json');
var i = 0;
var allForms = Array();

function processForms() {
  if (i < formList.length) {
    var cmd = 'wget http://drupal.lib.virginia.edu/webform_rest/'+formList[i].webform[0].target_id+'/elements?_format=json -O frmDetail'+formList[i].webform[0].target_id+'.json'
    exec(cmd, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
      } else {
        var form = {
          title: formList[i].title[0].value,
          url: formList[i].webform[0].url,
          target_id: formList[i].webform[0].target_id,
          webform: require('./frmDetail'+formList[i].webform[0].target_id+'.json')
        }
        allForms[i] = form;
      }
      i++;
      processForms();
    });
  } else {
    console.log(JSON.stringify(allForms));
  }
}

processForms();
