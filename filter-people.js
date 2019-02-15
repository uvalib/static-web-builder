var _ = require('lodash'),
    rp = require('request-promise'),
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
  field_orcid_id: {
    newName: "field_orcid_id",
    props: {value:String}
  },
  field_preferred_pronouns: {
    newName: "pronouns",
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
  field_website: {
    newName:"site",
    props: {value:String}
  },
  field_library: {
    newName:"library",
    props: {
      target_uuid: {type: String, newName: "uuid"}
    }
  },
  field_address: {
    newName:"address",
    props: {value:String}
  },
  field_ask_me_about: {
    newName:"askMeAbout",
    props: {value:String}
  },
  field_cv: {
    newName:"cv",
    props: {uri:String}
  },
  field_email_alias: {
    newName:"emailAlias",
    props: {value:String}
  },
  field_employee_preferred_name: {
    newName:"preferredName",
    props: {value:String}
  },
  field_languages_spoken: {
    newName:"languages",
    props:{value:String}
  },
  field_research_guides: {
    newName:"guides",
    props:{uri:String}
  },
  field_subject_specialties: {
    newName:"specialties",
    props:{value:String}
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

function capFL(string) {
    if (string)
    return string.charAt(0).toUpperCase() + string.slice(1);
    else return string;
}

var tweekPerson = function(person){
  var p = {
    fullName: person.displayName,
    address: clean(person.physicalDeliveryOfficeName),
    computingId: person.uid,
    email: person.mailForwardingAddress,
    nickName: person.eduPersonNickname,
    jobTitle: clean(person.title),
//    displayName: person.displayName,
    displayName: capFL(person.givenName) + " " + capFL(person.sn),
    phone: clean(person.telephoneNumber).replace(/^\+1 /g,''),
    fax: clean(person.facsimileTelephoneNumber).replace(/^\+1 /g,''),
    firstName: capFL(person.givenName),
    lastName: capFL(person.sn),
    middleName: person.initials
  };
  return stripEmpty(p);
};

async function getPeopleFromLdap(){
  var client = new LdapClient({url: 'ldap://ldap.virginia.edu'});
  var base = "ou=People,o=University of Virginia,c=US";
  var staff = await client.search(base, {filter:"(|(ou=E0:LB-Univ Librarian-General*)(ou=E0:LB-Organizational Dev)(ou=E0:LB-Central Svcs*)(ou=E0:LB-User Svcs*)(&(ou=E0:LB-Info Technology)(!(uvaPersonFoundationName=Judge Advocate General School))))", scope:'sub'});
//  var staff = await client.search(base, {filter:"ou=E0:LB-Central Svcs", scope:'sub'});
  return staff.entries.map(s=>{return tweekPerson(s.object)});
}

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
  var people = peopleFromLdap.filter(p=>(!p.private || (Object.keys(p.private).length === 0 && p.private.constructor === Object)));


  var t = await rp({uri:'https://uvalib-api.firebaseio.com/teams.json',json:true});
  people.forEach(p=>{
    p.teams = t.filter(t=>(t.members)?t.members.includes(p.computingId):false).map(function(t){ return {uuid:t.uuid,title:t.title}; });
  });

  return people;
}

doIt().then(function(result){
  console.log(JSON.stringify(result))
  process.exit()})
.catch(function(e){console.log(e); process.exit(1)});
