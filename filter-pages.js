var jsontr = require('./json-transform.js');

var items = require('./pages.json');
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
  body: {
    props: {value: String}
  },
  field_parent_page: {
    newName: "parentPage",
    props: {target_id:{newName:'id',type:Number},target_uuid:{newName:'uuid',type:String}}
  },
  field_path: {
    newName: "path",
    props: {value: String}
  },
  field_sidebar: {
    newName: "sidebar",
    props: {target_uuid: {newName:'uuid',type:String}}
  },
  field_subnav: {
    newName: "subnav",
    props: {target_uuid: {newName:'uuid',type:String}}
  },
  field_serve_via_iframe: {
    newName: "iframe",
    props: {value:Boolean}
  },
  field_advanced_hide_title_breadc: {
    newName: "hideHeader",
    props: {value:Boolean}
  },
  field_advanced_alt_template: {
    newName: "template",
    props: {value:String}
  },
  field_advanced_no_bots: {
    newName: "noCrawl",
    props: {value:Boolean}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
