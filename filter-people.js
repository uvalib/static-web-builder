var _ = require('lodash'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2)),
    jsontr = require('./json-transform.js');

if (!argv.f) {
  console.log( "You must specify the JSON file that you want to merge with the -f flag!" );
  process.exit()
}

var items = require('./people.json');
var transform = {
  "@context": "http://schema.org",
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  changed: {
    props: {value:Number}
  },
  title: {
    newName: "fullName",
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_address: {
    newName: "address",
    props: {value: String}
  },
  field_computing_id: {
    newName: "computingId",
    props: {value: String}
  },
  field_email_alias: {
    newName: "emailAlias",
    props: {value: String}
  },
  field_employee_preferred_name: {
    newName: "nickName",
    props: {value: String}
  },
  field_image: {
    props: {
      alt:String, width:Number, height:Number, url:String,
      target_uuid: {type: String, newName: "uuid"}
    }
  },
  field_job_title: {
    newName: "title",
    props: {value:String}
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

fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data);

  var peps = jsontr.transform(items,transform);
  _.values(staff_dir.allMembers).forEach(function(person){
    if (peps.find(function(p){return p.computingId===person.uid})) {
      
    } else {
      peps.push({computingId:person.uid});
    }
  });

  console.log( JSON.stringify( peps ) );

});
