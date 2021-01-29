// This simply gets the hours of opperation from springshare and drops it into the occupancy database for libraries
const fetch = require('node-fetch'),
      admin = require("firebase-admin");  
      
var { DateTime } = require('luxon');
var now = DateTime.local();     

const serviceAccount = require(process.env.FIREBASEKEY);
const libcalURL = "https://api3.libcal.com/api_hours_grid.php?format=jsonld&iid=863&lid=";


fetch('https://drupal.lib.virginia.edu/libs?_format=json').then(res=>res.json()).then((d)=>{

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

      var drupalLoc = d.find(l=>l['field_slug'][0].value==key);
      var openagain = false;
      if (drupalLoc && drupalLoc['field_closure_override'] && drupalLoc['field_closure_override'].length > 0) {
        openagain = DateTime.fromSeconds( drupalLoc['field_closure_override'][0].value );
        if (now <= openagain && location.tempClosed != openagain.toMillis())
          promises.push( occupancyDb.ref('locations-schemaorg/location/'+key+'/tempClosed').set(openagain.toMillis()) );
      }

      var isOpen = false;
      // eval if the loc is open currently
      if (Array.isArray(location.openingHoursSpecification)) {
        var todays = location.openingHoursSpecification.find(d=>{ 
          return ( DateTime.fromISO(d.validFrom+'T'+d.opens+':00').toMillis() <= now.toMillis() && now.toMillis() <= DateTime.fromISO(d.validThrough+'T'+d.closes+':00').toMillis() )
        });
        // if we have a day, then the location is currently open)
        if (now <= openagain) todays = false;
        if (location.isOpenNow != !!(todays))
          promises.push( occupancyDb.ref('locations-schemaorg/location/'+key+'/isOpenNow').set(!!(todays)) );
      }        


    }
    Promise.all(promises).then(()=>process.exit(0)) 

  });

});
