var jsontr = require('./json-transform.js');

var items = require('./forms.json');
var transform = {
  "@context": "http://schema.org",
  nid: {
    newName: 'id',
    props: {value:String}
  },
  uuid: {
    props: {value:String}
  },
  title: {
    props: {value:String}
  },
  body: {
    props: {value:String}
  },
  field_anonymous: {
    newName: "anonymous",
    props: {value:Boolean}
  },
  field_auto_: {
    newName: "autoRespond",
    props: {value:String}
  },
  field_message: {
    newName: "message",
    props: {value:String}
  },
  field_recipients: {
    newName: "recipients",
    props: {value:String}
  },
  field_redirect_path: {
    newName: "redirectPath",
    props: {value:String}
  },
  field_require_authentication: {
    newName: "requireAuthentication",
    props: {value:Boolean}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
