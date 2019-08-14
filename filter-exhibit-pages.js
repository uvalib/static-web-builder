var jsontr = require('./json-transform.js');

var items = require('./exhibit-pages.json');
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
  field_book_tour: {
    newName: 'bookTour',
    props: {value:String}
  },
  field_category_id: {
    newName: "categoryId",
    props: {value:String}
  },
  field_end_date: {
    newName: "endDate",
    props: {value:String}
  },
  field_start_date: {
    newName: "startDate",
    props: {value:String}
  },
  field_exhibition_css: {
    newName: "exhibition_css",
    props: {value:String}
  },
  field_further_location_informati: {
    newName: "locationInfo",
    props: {value:String}
  },
  field_image: {
    newName: "image",
    props: {alt:String, width:Number, height:Number, url:String}
  },
  field_libcal_id: {
    newName: "libcalId",
    props: {value:String}
  },
  field_library: {
    newName: "library",
    props: {target_id:{newName:"id",type:Number}, target_uuid:{newName:"uuid",type:String}}
  },
  field_press_kit: {
    newName: "pressKit",
    props: {uri:String}
  },
  field_redirects_from_: {
    newName: "redirectsFrom",
    props: {uri:String}
  },
  field_subtitle: {
    newName: "subTitle",
    props: {value:String}
  },
  field_url_slug: {
    newName: "urlSlug",
    props: {value:String}
  },
  field_style_exhibit_header: {
    newName: "styleHeaderColor",
    props: {color:String}
  },
  field_style_exhibit_header_text_: {
    newName: "styleHeaderTextColor",
    props: {color:String}
  },
  field_style_pre_footer_backgroun: {
    newName: "stylePreFooterBackColor",
    props: {color:String}
  },
  field_news_item_source_text_colo: {
    newName: "styleNewsItemSourceTextColor",
    props: {color:String}
  },
  field_style_font_import: {
    newName: "styleFontImport",
    props: {value:String}
  },
  field_style_body_font: {
    newName: "styleFont",
    props: {value:String}
  },
  field_style_body_font_fallback: {
    newName: "styleFontFallback",
    props: {value:String}
  },
  field_style_headline_font: {
    newName: "styleHeadlineFont",
    props: {value:String}
  },
  field_style_headline_font_fallba: {
    newName: "styleHeadlineFontFallback",
    props: {value:String}
  }
};

var items = jsontr.transform(items,transform).map(exh=>{
  if (exh.styleFontImport && exh.styleFontImport.indexOf("@import")==-1) exh.styleFontImport = "@import url('"+exh.styleFontImport+"');";
  return exh;
});


var json = JSON.stringify(items)
  .replace(/drupal\.lib\.virginia\.edu\/sites\/default\/files\//g,"www.library.virginia.edu/files/")
  .replace(/\/sites\/default\/files\//g,"https://www.library.virginia.edu/files/")
console.log( json );
