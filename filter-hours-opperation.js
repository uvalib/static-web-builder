// This simply gets the hours of opperation from springshare and drops it into the occupancy database for libraries
const fetch = require('node-fetch'),
      admin = require("firebase-admin");   

const serviceAccount = require(process.env.FIREBASEKEY);
const libcalURL = "https://api3.libcal.com/api_hours_grid.php?format=jsonld&iid=863&lid=";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://uvalib-api.firebaseio.com`
});
let app = admin.app();
const apiDb = app.database();
const occupancyDb = app.database("https://uvalib-api-occupancy.firebaseio.com/");

apiDb.ref('libraries').once("value",libraries=>{  

  var hoursKeys = libraries.val().reduce( (a,c)=>{ a[c.slug]=c.libcalID; return a;} ,{} )

  occupancyDb.ref('locations-schemaorg/location').once("value",loc=>{
    var promises = [];
    let locations = loc.val();
    for (const key in locations) {
      const location = locations[key];
      if (location["@type"]==="Library" && hoursKeys[key])
      promises.push (fetch(libcalURL+hoursKeys[key]).then(res=>res.json())
        .then(json=>{
          console.log("write hours");
          if (json.openingHoursSpecification)
            return occupancyDb.ref('locations-schemaorg/location/'+key+'/openingHoursSpecification').set(json.openingHoursSpecification);
          else
            return Promise.resolve();  
        }));
    }
    Promise.all(promises).then(()=>process.exit(0)) 
  });

});