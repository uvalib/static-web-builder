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
//  "@context": "http://schema.org",
//  nid: {
//    newName: 'id',
//    props: {value:String}
//  },
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
    newName: "email",
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
    newName: "jobTitle",
    props: {value:String}
  },
  field_linkedin: {
    newName: "linkedin",
    props: {value:String}
  },
  field_primary_office_location: {
    newName: "officeLocation",
    props: {value:String}
  },
  field_primary_phone: {
    newName: "phone",
    props: {value:String}
  },
  field_professional_profile: {
    newName:"profile",
    props: {value:String}
  },
  field_twitter: {
    newName:"twitter",
    props: {value:String}
  },
};

fs.readFile(argv.f,{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data);

  var peps = jsontr.transform(items,transform);
  _.values(staff_dir.allMembers).forEach(function(person){
    var pep = peps.findIndex(function(p){return p.computingId===person.uid});
    if (pep != -1) {
      var p = tweekPerson(person);
      for (key in peps[pep]) {
         if (Array.isArray(peps[pep][key]) && peps[pep][key].length == 0) delete peps[pep][key];
      }
//      peps[pep] = _.merge(p,peps[pep]);
      peps[pep] = Object.assign({},p,peps[pep]);
    } else {
      peps.push(tweekPerson(person));
      pep = peps.length-1;
    }
    peps[pep].rid = (peps[pep].email && typeof peps[pep].email === "string")? peps[pep].email.substring(0,peps[pep].email.lastIndexOf("@")).split("").reverse().join(""):null;
  });

  console.log( JSON.stringify( peps ) );

});

var tweekPerson = function(person){
  var p = {
    fullName: person.eduPersonNickname? person.eduPersonNickname:person.sn+", "+person.givenName,
    address: person.physicalDeliveryOfficeName,
    computingId: person.uid,
    email: person.mail,
    nickName: person.eduPersonNickname,
    jobTitle: person.title,
    displayName: person.displayName? person.displayName: (person.eduPersonNickname)? person.eduPersonNickname.split(',').reverse().join(' '): person.givenName+" "+person.sn,
    phone: (typeof person.telephoneNumber === "string")? person.telephoneNumber.replace(/^\+1 /,''):null,
    fax: (typeof person.OfficeFax === "string")? person.OfficeFax.replace(/^\+1 /,''):null,
    firstName: person.givenName,
    lastName: person.sn,
    middleName: person.initials    
  };
  
  return p;
};
