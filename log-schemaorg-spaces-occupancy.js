const
      spaces = require('./spaces.json'),
      counts = require('./counts.json'),
      admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require(process.env.firebasekey);

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://uvalib-api-occupancy.firebaseio.com/"
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
        promises.push(ref.child('location/'+key+'/containedInPlace/'+placekey).update( lib.containedInPlace[placekey] ))
      }
    }
  }
  Promise.all(promises)
    .then(()=>{
      // log latest headcount and non mask count per space
      for (key in libs) {
        var lib = libs[key];
        if (lib.containedInPlace) {
          var totalCount = 0;
          var startCount = "";
          var endCount = "";
          var totalnmCount = 0;
          var startnmCount = null;
          var endnmCount = null;
          for (placekey in lib.containedInPlace) {
            var place = lib.containedInPlace[placekey];
            if (place.headCounts) {
              const latestTimestamp = Object.keys(place.headCounts).sort().reverse()[0];
              const count = place.headCounts[latestTimestamp].count;
              place.occupancy = {"value":count,"timestamp":latestTimestamp};
              promises.push(ref.child('location/'+key+'/containedInPlace/'+placekey).update( {"occupancy":place.occupancy} ));
              totalCount += count;
              startCount = (latestTimestamp < startCount || !startCount )? latestTimestamp:startCount;
              endCount = (latestTimestamp > endCount || !endCount )? latestTimestamp:endCount;
            }
            if (place.noMaskCounts) {
              const latestTimestamp = Object.keys(place.noMaskCounts).sort().reverse()[0];
              const count = place.noMaskCounts[latestTimestamp].count;
              place.noMaskCount = {"value":count,"timestamp":latestTimestamp};
              promises.push(ref.child('location/'+key+'/containedInPlace/'+placekey).update( {"noMaskCount":place.noMaskCount} ));
              totalnmCount += count;
              startnmCount = (latestTimestamp < startnmCount || !startnmCount )? latestTimestamp:startnmCount;
              endnmCount = (latestTimestamp > endnmCount || !endnmCount )? latestTimestamp:endnmCount;
            }
          }
          lib.occupancy = {"value":totalCount,"timestamp_start":startCount,"timestamp_end":endCount};
          promises.push(ref.child('location/'+key).update( {"occupancy":lib.occupancy} ));
          lib.noMaskCount = {"value":totalnmCount,"timestamp_start":startnmCount,"timestamp_end":endnmCount};
          promises.push(ref.child('location/'+key).update( {"noMaskCount":lib.noMaskCount} ));
        }
      }
      return Promise.all(promises);
    })
    .then(()=>process.exit(0));
})
