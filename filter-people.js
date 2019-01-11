var _ = require('lodash'),
    argv = require('minimist')(process.argv.slice(2)),
    jsontr = require('./json-transform.js'),
    LdapClient = require('promised-ldap')

var items = require('./people.json');
var transform = {
  uuid: {
    props: {value:String}
  },
  changed: {
    props: {value:Number}
  },
  body: {
    props: {value: String}
  },
  field_computing_id: {
    newName: "computingId",
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
  field_blogs: {
    newName:"blogs",
    prop: {value:String}
  },
  field_library: {
    newName:"library",
    props: {
      target_uuid: {type: String, newName: "uuid"}
    }
  },
  field_private: {
    newName:"private",
    prop: {value:Boolean}
  }
};

function stripEmpty(o) {
  for(k in o) {
    var v = o[k]
    if (v==="" || v===null || v===undefined || (v && v.length==0))
      delete o[k]
  }
  return o
}

var clean = function(item) {
  return item?
    Array.isArray(item)? 
      item.join(', '): 
      item.replace(/^E0:/,''):
    "";
}

var tweekPerson = function(person){
  var p = {
    fullName: person.displayName,
    address: clean(person.physicalDeliveryOfficeName),
    computingId: person.uid,
    email: person.mailForwardingAddress,
    nickName: person.eduPersonNickname,
    jobTitle: clean(person.title),
    displayName: person.displayName,
    phone: clean(person.telephoneNumber).replace(/^\+1 /g,''),
    fax: clean(person.facsimileTelephoneNumber).replace(/^\+1 /g,''),
    firstName: person.givenName,
    lastName: person.sn,
    middleName: person.initials
  };
  return stripEmpty(p);
};

async function getPeopleFromLdap(){
  var client = new LdapClient({url: 'ldap://ldap.virginia.edu'});
  var base = "ou=People,o=University of Virginia,c=US";
  var staff = await client.search(base, {filter:"(|(ou=E0:LB-Univ Librarian-General*)(ou=E0:LB-Central Svcs)(ou=E0:LB-User Svcs*))", scope:'sub'});
  return staff.entries.map(s=>{return tweekPerson(s.object)}); 
}

var result;
async function doIt(){
  var peopleFromDrupal = jsontr.transform(items,transform).reduce(function(o,val){ o[val.computingId]=stripEmpty(val); return o; },{});
  var peopleFromLdap = await getPeopleFromLdap();
  // Merge the peopleFromLdap with peopleFromDrupal with drupal having priority priority for same keys
  //var result = peopleFromLdap.map((uid)=>Object.assign(peopleFromLdap[uid], peopleFromDrupal[uid]))
  peopleFromLdap.forEach(p=>{
    if (peopleFromDrupal[p.computingId]) {
      p = Object.assign(p, peopleFromDrupal[p.computingId]);      
    }    
  });
  //console.log(JSON.stringify(result))
  result = peopleFromLdap.filter(p=>!p.private);
}

doIt().then(function(){
  console.log(JSON.stringify(result))
  process.exit()})
.catch(function(e){console.log(e); process.exit(1)});
