// This simply gets the hours of opperation from springshare and drops it into the occupancy database for libraries
const fetch = require('node-fetch'),
      admin = require("firebase-admin");  
      
var { DateTime } = require('luxon');
var now = DateTime.local();     

const serviceAccount = require(process.env.FIREBASEKEY);
const libcalURL = "https://api3.libcal.com/api_hours_grid.php?format=jsonld&iid=863&lid=";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://uvalib-api.firebaseio.com`
});
let app = admin.app();
const apiDb = app.database();
const occupancyDb = app.database("https://uvalib-api-occupancy.firebaseio.com/");

occupancyDb.ref('locations-schemaorg/location').once("value",loc=>{
//  var promises = [];
  let locations = loc.val();
  var promises = [];
  for (const key in locations) {
    const location = locations[key];

    var isOpen = false;
    // eval if the loc is open currently
    if (Array.isArray(location.openingHoursSpecification)) {
      var todays = location.openingHoursSpecification.find(d=>{ 
        return ( DateTime.fromISO(d.validFrom+'T'+d.opens+':00').toMillis() <= now.toMillis() && now.toMillis() <= DateTime.fromISO(d.validThrough+'T'+d.closes+':00').toMillis() )
      });
      // if we have a day, then the location is currently open)
      if (location.isOpenNow != !!(todays))
        promises.push( occupancyDb.ref('locations-schemaorg/location/'+key+'/isOpenNow').set(!!(todays)) );
    }        
//    promises.push (fetch(libcalURL+hoursKeys[key]).then(res=>res.json())
//      .then(json=>{
//        console.log("write hours");
//        if (json.openingHoursSpecification)
//          return occupancyDb.ref('locations-schemaorg/location/'+key+'/openingHoursSpecification').set(json.openingHoursSpecification);
//        else
//          return Promise.resolve();  
//      }));
  }
  Promise.all(promises).then(()=>process.exit(0)) 

});
