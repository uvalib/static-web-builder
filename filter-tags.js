var jsontr = require('./json-transform.js');
const fetch = require('node-fetch');

fetch("https://drupal.lib.virginia.edu/rest/tags?_format=json")
  .then(res => res.json())
  .then(async function(items){

    var transform = {
      uuid: {
        props: {value:String}
      },
      name: {
        props: {value:String}
      },
      description: {
        props: {value:String}
      },
      field_url_to_icon: {
        newName: 'icon',
        props: {uri:String}
      }
    };

        var items = jsontr.transform(items,transform)
        var json = JSON.stringify( items ).replace("drupal.lib.virginia.edu/sites/default","wwwstatic.lib.virginia.edu");
        console.log( json );

    });
