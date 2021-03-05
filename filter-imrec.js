const admin = require('firebase-admin');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const serviceAccount = require(process.env.FIREBASEKEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASENAME}.firebaseio.com`
});
const db = admin.database();

let map = {
  'NGRC':{
    'id':'9c9dfc3a-0c6c-426a-81e5-78db625f2a09',
    'url':'https://recsports.virginia.edu/ngrc',
    'telephone':'+14349247380',
    "isActive":true,
  },
  'NGRCpool':{
    'id':'68c0f32c-8718-465f-bcd8-d71e82f5e319'
  },
  'AFC':{
    'id':'0aeb2543-e6f0-4508-a6f5-f744871a52dd'
  },
  'AFCpool':{
    'id':'72d8c89e-642d-4611-99f7-ed5b8aa34a20'
  },
  'MEM':{
    'id':''
  },
  'SRC':{}
}

fetch("https://recsports.virginia.edu/")
  .then(res=>res.text())
  .then(text=>{
    // Get Facility Info (open/close)
}).then(i=>{

  return fetch("https://www.go.recsports.virginia.edu/facilityoccupancy")
    .then(res=>res.text())
    .then(text=>{

    let mapped = Object.keys(map).map(k=>{ map[k].slug=k; return map[k]; });
    var result = {}

    const dom = new JSDOM(text);
    dom.window.document.querySelectorAll('.facility-container').forEach((f)=>{
      let fid = f.getAttribute('data-facilityid');
      let space = mapped.find(s=>{ return fid == s.id });

      result[space.slug] = {
        "@context":"http://schema.org",
        "@id":"https://www.go.recsports.virginia.edu/facility/"+fid,
        "@type":"IMRec",
  //      "geo":{"@type":"GeoCoordinates","latitude":38.0331,"longitude":-78.507999},
  //      "image":["https://library.virginia.edu/files/2018-03/Brown_ServiceDesk.jpg"],
  //      "isOpenNow":false,
        "maximumAttendeeCapacity":f.querySelector('.max-occupancy strong').textContent.trim(),
        "name":f.querySelector('.occupancy-card-header h2').textContent.trim(),
        "occupancy":{
          "timestamp_end":Date.now(),
          "timestamp_start":Date.now(),
          "value": f.querySelector('.occupancy-count strong').textContent.trim()
        },

      };


    });
    return result;

  }).then( r=>{
    var promises = [];
    // r is our rec spaces with counts, time to write to db
    for (const key in r) {
      const space = r[key];
      if (space.occupancy) {
        const ref = db.ref("locations-schemaorg/location/"+key);
        promises.push( ref.once("value").then(snapshot=>{
          return snapshot.val();
        }).then(val=>{
          if (val) {
            console.log("we have a value");
            return db.ref("locations-schemaorg/location/"+key).update({
              maximumAttendeeCapacity: space.maximumAttendeeCapacity,
              occupancy: space.occupancy
            });
          } else {
            console.log("no value yet");
            console.log("locations-schemaorg/location/"+key);
            space.isActive = true;
            return db.ref("locations-schemaorg/location/"+key).set(space);
          }
        }) );
      }
    }
    return Promise.all(promises);
  });

}).then(process.exit);
