var jsontr = require('./json-transform.js');

var items = require('./mediaobjects.json');
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
  field_association: {
    newName: "association",
    props: {value: String}
  },
  field_attribution: {
    newName: "attribution",
    props: {value: String}
  },
  field_media_object_img: {
    newName: "image",
    publishImage: 'url',
    props: {
        "@type": "ImageObject",
        alt:String, width:Number, height:Number, url:String,
        target_uuid:{
              type: String,
              newName: "uuid"
        }
    }
  }
};

console.log( JSON.stringify( jsontr.transform(items,transform) ) );
