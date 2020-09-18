const admin = require('firebase-admin');
const fetch = require('node-fetch');
const DigestFetch = require('digest-fetch');

const serviceAccount = require(process.env.FIREBASEKEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASENAME}.firebaseio.com`
});
const db = admin.database();

const occupancyEstimators = [{
  userId: process.env.AXISUSER,
  pass: process.env.AXISPASS,
  domain: "axis-sel-main-c120.lib.virginia.edu",
  fbpath: "locations-schemaorg/location/science/estimatedOccupancy",
  fblogpath: "locations-schemaorg/location/science/estimatedOccupancyLog"
}]

var promises = [];

occupancyEstimators.forEach(oe=>{
  const client = new DigestFetch(oe.userId, oe.pass, { algorithm: 'MD5' })
  promises.push(client.fetch(`http://${oe.domain}/local/occupancy-estimator/.api?live-occupancy.json`)
    .then(res => res.json())
    .then((data)=>{
      const ref = db.ref(oe.fbpath);
      return ref.once("value").then(snapshot=>{
        var promises = [];
        var val = snapshot.val();
        var loggit = false;
        if (!val) val = {timestamp:null, value:null, totalIn:null, totalOut:null};
        var newval = {};
        if (data.occupancy !== val.value) {
          newval.value = data.occupancy;
          loggit = true;
        }
        if (data['total in'] != val.totalIn) {
          newval.totalIn = data['total in'];
          loggit = true;
        }
        if (data['total out'] != val.totalOut) {
          newval.totalOut = data['total out'];
          loggit = true;
        }
        var newtimestamp = data.unixtime*1000;
        // log if occupancy changed
        if (loggit) {
          promises.push( db.ref(oe.fblogpath+'/'+newtimestamp).set(newval) );
        }
        // update main
        newval.timestamp = newtimestamp;
        promises.push( ref.update(newval) );
        console.log(data);
        return Promise.all(promises);
      });
    }));
});

Promise.all(promises).then(process.exit);