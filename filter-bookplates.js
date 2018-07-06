var jsontr = require('./json-transform.js'),
    request = require('request-promise'),
    items = require('./bookplates.json');

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
  field_date: {
    newName: "date",
    props: {value: String}
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

async function process(items, transform){
//  console.log(items);
  var items = jsontr.transform(items,transform);
//  console.log(items);
  for (var i=0; i<items.length; i++) {
    var item = items[i];
//    console.log(item);
    if (item.bookplateImage && item.bookplateImage.url) item.bookplateImage.url = item.bookplateImage.url.replace('https://drupal.lib.virginia.edu/sites/default/','https://wwwstatic.lib.virginia.edu/');
    if (item.fundID) {
      item.url = "https://www.library.virginia.edu/bookplates/"+item.fundID;

      var bps = await request('https://search.lib.virginia.edu/catalog.json?f%5Bfund_code_facet%5D%5B%5D='+item.fundID+'&per_page=1');
      if (bps) bps = JSON.parse(bps);
      if (bps.response && bps.response.numFound > 0) {
//        console.log('has bookplates!!!!!');
        item.bookplateResults = true;
      }
    }
  }
  console.log( JSON.stringify( items ) );
}

//var items = jsontr.transform(items,transform);
//items.forEach(function(item){
//  process(item);
//});
process(items, transform);
