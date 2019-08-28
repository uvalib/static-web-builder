var jsontr = require('./json-transform.js');
var striptags = require('striptags');
const fetch = require('node-fetch');

fetch("https://drupal.lib.virginia.edu/rest/learning-items?_format=json")
  .then(res => res.json())
  .then(async function(items){

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
      },
      field_testing_taxonomy: {
        newName: "tags",
        props: {target_uuid:String}
      }
    };

    var tags = await fetch("https://drupal.lib.virginia.edu/rest/tags?_format=json")
                    .then(res => res.json())
                    .then(function(tags){
                      return jsontr.transform(tags,{
                        uuid: {
                          props: {value:String}
                        },
                        name: {
                          props: {value:String}
                        },
                        description: {
                          props: {value:String}
                        },
                        field_url_to_icon: {
                          newName: 'icon',
                          props: {uri:String}
                        }
                      }).map(i=>{
                        i.description = striptags(i.description);
                        return i;
                      });
                    });

        var items = jsontr.transform(items,transform).map(i=>{
          i.tags = (Array.isArray(i.tags))?
            i.tags.map(i=>tags.find(t=>t.uuid==i.target_uuid)):
            [tags.find(t=>t.uuid==i.tags)];
          i.tagids = i.tags.map(i=>i.uuid);
          if (i.learningItemUrl && i.learningItemUrl.indexOf('youtu.be')>-1 || i.learningItemUrl.indexOf('youtube.com')>-1)
            i.youtubeId = i.learningItemUrl.replace(/.*youtu.be\//,"").replace(/.*youtube.com\/embed\//,"");
          if (i.category && typeof i.category === "string" )
            i.category = [i.category.toLowerCase()];
          else if (i.category && Array.isArray(i.category))
            i.category = i.category.map(j=>j.value.toLowerCase());
          i.simpleTitle = i.title.replace(/\(.*\)/,'');
          i.textBody = striptags(i.body);
          i.actionTerm = (i.format === 'video')?
            "Watch":"Go to";
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


    });
