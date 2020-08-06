const libraries = require('./libraries.json'),
      placeTypes = require('./placeTypes.json'),
      spaces = require('./spaces.json'),
      mustache = require('mustache'),
      fetch = require('node-fetch'),
      admin = require("firebase-admin");

const template = `
{{=<% %>=}}
{ "@context" : "http://schema.org",
  "@type" : "Organization",
  "url" : "https://library.virginia.edu",
  "location" : \{
<% #libraries %>
    "<% slug %>":{
      "@context": "http://schema.org",
      "@type": "Library",
      <% #image_url %>
      "image": [
        "<%{ image_url }%>"
       ],
      <% /image_url %>
      "@id": "https://www.library.virginia.edu/libraries/<% slug %>",
      "name": "<% title %>",
      <% #address %>
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "291 McCormick Rd",
        "addressLocality": "Charlottesville",
        "addressRegion": "VA",
        "postalCode": "22903",
        "addressCountry": "US"
      },
      <% /address %>
      <% #geo %>
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": <% geo.lat %>,
        "longitude": <% geo.lng %>
      },
      <% /geo %>
      "url": "https://www.library.virginia.edu/libraries/<% slug %>",
      <% #capacity %>
      "maximumAttendeeCapacity": <% capacity %>,
      <% /capacity %>
      <% #libcal %>
      "openingHoursSpecification": <% libcal %>,
      <% /libcal %>
      "telephone": "+1<% phone %>"
    }<% ^last %>,<% /last %>
<% /libraries %>
  }
}
`;

libraries[ libraries.length -1 ].last = true;
libraries.forEach(lib=>{
  lib.slug = lib.field_slug[0].value;
  lib.image_url = (lib.field_main_image && lib.field_main_image.length>0)? lib.field_main_image[0].url.replace('drupal.lib.virginia.edu/sites/default/files','library.virginia.edu/files'):null;
  lib.title = lib.title[0].value;
  if (lib.field_fm_location && lib.field_fm_location.length > 0) {
    lib.geo = {lat:lib.field_fm_location[0].lat,lng:lib.field_fm_location[0].lng}
  }
  if (lib.field_phone_number && lib.field_phone_number.length > 0) {
    lib.phone = lib.field_phone_number[0].value.replace(/[\-\(\)\s]/g,'');
  }
  if (lib.field_occupancy_capacity && lib.field_occupancy_capacity.length > 0) {
    lib.capacity = lib.field_occupancy_capacity[0].value;
  }
  if (lib.field_libcal_id && lib.field_libcal_id.length > 0) {
    lib.libcal = lib.field_libcal_id[0].value;
  }
});

result = mustache.render(template, { libraries:libraries, places:placeTypes } );

var plibs = JSON.parse(result);

async function fetchCalHours(){
  for (key in plibs.location) {
    var lib = plibs.location[key];
    if (lib.openingHoursSpecification) {
      const json = await fetch("https://api3.libcal.com/api_hours_grid.php?format=jsonld&iid=863&lid="+lib.openingHoursSpecification)
        .then(res => {
          if (res.ok) return res;
          else console.log("failed: "+res.statusText);
        })
        .then(res => res.json());
      if (json.openingHoursSpecification)
        plibs.location[key].openingHoursSpecification = json.openingHoursSpecification;
      else delete plibs.location[key].openingHoursSpecification;
    }
    if (spaces[key])
      plibs.location[key].containedInPlace = spaces[key];
  }
}

return fetchCalHours()
  .then(()=>{
    // Fetch the service account key JSON file contents
    var serviceAccount = require(process.env.firebasekey);

    // Initialize the app with a service account, granting admin privileges
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://uvalib-api.firebaseio.com"
    });
    var db = admin.database();
    var ref = db.ref("locations-schemaorg");
    //ref.update(plibs).then(() => process.exit(0));
    var promises = [];
    for (key in plibs.location) {
      for (prop in plibs.location[key]) {
        if (prop == "containedInPlace" || prop == "openingHoursSpecification") {
          for (place in plibs.location[key][prop]) {
            var val = {}; val[place]= plibs.location[key][prop][place];
            promises.push(ref.child('location/'+key+'/'+prop+'/'+place).update( val ));
          }
        } else {
          var val = {}; val[prop]= plibs.location[key][prop];
          promises.push( ref.child('locations-schemaorg/location/'+key+'/'+prop).update( val ) );
        }
      }
    }
    Promise.all(promises).then(()=>process.exit(0));
  });
