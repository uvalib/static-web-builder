var jsontr = require('./json-transform.js');

var items = require('./learning.json');
var transform = {
  uuid: {
    props: {value:String}
  },
  created: {
    props: {value:Number}
  },
  changed: {
    props: {value:Number}
  },
  sticky: {
    props: {value:Boolean}
  },
  promote: {
    props: {value:Boolean}
  },
  title: {
    props: {value: String}
  },
  body: {
    props: {value: String}
  },
  field_link_to_learning_item: {
    newName: "learningItemUrl",
    props: {uri:String}
  },
  field_source: {
    newName: "source",
    props: {value:String}
  },
  field_category: {
    newName: "category",
    props: {value:String}
  },
  field_format: {
    newName: "format",
    props: {value:String}
  },
  field_length: {
    newName: "length",
    props: {value:Number}
  }
};

var items = jsontr.transform(items,transform).map(i=>{
  if (i.learningItemUrl && i.learningItemUrl.indexOf('youtu.be')>-1 || i.learningItemUrl.indexOf('youtube.com')>-1)
    i.youtubeLink = i.learningItemUrl;
  if (i.category && typeof i.category === "string" )
    i.category = [i.category.toLowerCase()];
  else if (i.category && Array.isArray(i.category))
    i.category = i.category.map(j=>j.value.toLowerCase());
  i.simpleTitle = i.title.replace(/\(.*\)/,'');
  i.formatDisplay = (i.format === 'doc')?
    "Document (PDF or other download)":
    (i.format === 'interactive')?
      "Interactive Tutorial":
      (i.format === 'oer')?
        "OER Repository":
        (i.format === 'lb-form')?
          "UVA Library Form":
          (i.format === 'video')?
            "Video":null;
  return i;
})
var json = JSON.stringify( items ).replace("drupal.lib.virginia.edu/sites/default","wwwstatic.lib.virginia.edu");
console.log( json );
