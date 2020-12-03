var jsontr = require('./json-transform.js');

var items = require('./library-alerts.json');
var transform = {
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  title: {
    props: {value: String}
  },
  created: {
    props: {value: String}
  },
  changed: {
    props: {value: String}
  },
  promote: {
    props: {value: Boolean}
  },
  sticky: {
    props: {value: Boolean}
  },
  body: {
    props: {value: String}
  },
  field_sitewide_severity: {
    newName: 'severity',
    props: {value: String}
  }
};

var alerts = jsontr.transform(items,transform);
//if (Array.isArray(alerts)) alerts = alerts.filter(a=>a.severity!="alert4");
console.log( JSON.stringify( alerts ) );
