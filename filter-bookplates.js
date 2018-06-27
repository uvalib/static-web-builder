var jsontr = require('./json-transform.js');

var items = require('./bookplates.json');
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
  field_bookplate_image: {
    newName: "bookplateImage",
    publishImage: 'url',
    props: {alt:String, width:Number, height:Number, url:String,
            target_uuid:{
              type: String,
              newName: "uuid"
            }
           }
  },
  field_fund: {
    newName: "fund",
    props: {value: String}
  },
  field_fund_award_name: {
    newName: "fundAwardName",
    props: {value: String}
  },
  field_fund_id: {
    newName: "fundID",
    props: {value: String}
  },
  field_restriction_summary: {
    newName: "restrictionSummary",
    props: {value: String}
  },
  field_summary: {
    newName: "summary",
    props: {value: String}
  }
};

var items = jsontr.transform(items,transform);
items.forEach(function(item){
  if (item.bookplateImage && item.bookplateImage.url) item.bookplateImage.url = item.bookplateImage.url.replace('https://drupal.lib.virginia.edu/sites/default/','https://wwwstatic.lib.virginia.edu/');
  if (item.fundID) item.url = "https://www.library.virginia.edu/bookplates/"+item.fundID;
});

console.log( JSON.stringify( items ) );
