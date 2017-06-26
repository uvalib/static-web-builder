var jsontr = require('./json-transform.js');

var items = require('./alerts.json');
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
  field_duration: {
    newName: 'duration',
    props: {value: String}
  },
  field_inactive: {
    newName: 'inactive',
    props: {value: Boolean}
  },
  field_library: {
    newName: 'libraryId',
    props: {target_uuid: String}
  },
  field_severity: {
    newName: 'severity',
    props: {value: String}
  },
  field_start_date: {
    newName: 'startDate',
    props: {value: String}
  },
  field_type_alert: {
    newName: 'alertType',
    props: {value: String}
  },
  field_url_fragment: {
    newName: 'url',
    props: {value: String}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
