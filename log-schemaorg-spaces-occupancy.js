const
      spaces = require('./spaces.json'),
      counts = require('./counts.json'),
      admin = require("firebase-admin");

console.log(counts);

// Fetch the service account key JSON file contents
var serviceAccount = require(process.env.firebasekey);

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://uvalib-api.firebaseio.com"
});
var db = admin.database();
var ref = db.ref("locations-schemaorg/");
var promises = [];
ref.child('location').once('value', (snap)=>{
  var libs = snap.val();
  for (key in libs) {
    var lib = libs[key];
    if (lib.containedInPlace) {
      for (placekey in lib.containedInPlace) {
        var place = lib.containedInPlace[placekey];
        // log any counts
        for (var i=0; i < counts.length; i++) {
          var entry = counts[i];
          if (entry.location.includes(place.sumaMatch)) {
            if (entry.activities[0]===1) {
              if(!place.headCounts) place.headCounts = {};
              place.headCounts[entry.time]={
                "count": entry.count
              }
            }
            else if (entry.activities[0]===2) {
              if(!place.noMaskCounts) place.noMaskCounts = {};
              place.noMaskCounts[entry.time]={
                "count": entry.count
              }
            }
            counts.splice(i,1);
          }
        }
        console.log('location/'+key+'/containedInPlace/'+placekey);
        promises.push(ref.child('location/'+key+'/containedInPlace/'+placekey).update( lib.containedInPlace[placekey] ))
      }
    }
  }
  Promise.all(promises).then(()=>process.exit(0));
})
