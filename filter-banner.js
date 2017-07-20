var jsontr = require('./json-transform.js');

var items = require('./banners.json');
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
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_display_title: {
    newName: "displayTitle",
    props: {value: Boolean}
  },
  field_shady_desktop: {
    newName: "shadyDesktop",
    props: {value: Boolean}
  },
  field_shady_tablet: {
    newName: "shadyTablet",
    props: {value: Boolean}
  },
  field_shady_mobile: {
    newName: "shadyMobile",
    props: {value: Boolean}
  },
  sticky: {
    props: {value: Boolean}
  },
  field_action_link: {
    newName: "link",
    props: {uri:String}
  },
  field_button_text: {
    newName: "buttonText",
    props: {value:String}
  },
  field_tone: {
    newName: "tone",
    props: {value:String}
  },
  field_desktop_image: {
    newName: "desktopImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_mobile_banner: {
    newName: "phoneImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_tablet_image: {
    newName: "tabletImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_narrow_text: {
    newName: "narrowText",
    props: {value: Boolean}
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
