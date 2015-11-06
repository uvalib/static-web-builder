var fs = require('fs'),
    request = require('request-json');

fs.readFile('dist/feeds/directory.json',{encoding:'utf-8'},function(err, data){

  var staff_dir = JSON.parse(data);
  var library_listing = {directory:staff_dir,
                         floorplans:{"alderman": {"id": "alderman","lat": 38.03660389902765,"lng": -78.5052216053009,"floors": ["1","1M","2","2M","3","3M","4","4M","5","5M"],"entranceFloor": "4","resolutionBounds": {"19": [[147811, 147813],[202164, 202165]],"20": [[295623, 295626],[404328, 404331]],"21": [[591247, 591252],[808657, 808663]]}},"astronomy": {"id": "astronomy","lat": 38.0356,"lng": -78.515299},"bio-psych": {"id": "bio-psych","lat": 38.0342,"lng": -78.513099},"science": {"id":"science","lat": 38.0331,"lng": -78.507999,"floors": ["0","I","1"],"labels": ["Ground (Book)", "Intermediate (Journal)", "Main (1st)"],"entranceFloor": "1","resolutionBounds": {"19": [[147807, 147809],[202171, 202172]],"20": [[295615, 295619],[404342, 404345]],"21": [[591231, 591238],[808684, 808690]]}},"chemistry": {"id": "chemistry","lat": 38.0332,"lng": -78.511899},"clemons": {"id": "clemons","lat": 38.03647714566911,"lng": -78.50601822137833,"floors": ["1","2","3","4"],"entranceFloor": "4","resolutionBounds": {"19": [[147810, 147811],[202164, 202166]],"20": [[295620, 295623],[404329, 404332]],"21": [[591241, 591247],[808659, 808664]]}},"darden": {"id": "darden","lat": 38.0528,"lng": -78.513999},"fine-arts": {"id": "fine-arts","lat": 38.0389868213391,"lng": -78.50343123078346,"floors": ["1","2","3"],"entranceFloor": "1","resolutionBounds": {"19": [[147813, 147815],[202160, 202161]],"20": [[295626, 295630],[404321, 404323]],"21": [[591253, 591261],[808642, 808647]]},"defaultZoom":20},"harrison": {"id": "harrison","lat": 38.036231,"lng": -78.505787,"floors": ["2","3"],"entranceFloor": "2","resolutionBounds": {"19": [[147811, 147812],[202165, 202166]],"20": [[295622, 295625],[404331, 404333]],"21": [[591244, 591250],[808662, 808667]]}},"special-collections": {"id": "harrison","lat": 38.036231, "lng": -78.505787 }, "health": { "id": "health", "lat": 38.0321, "lng": -78.501299 }, "law": { "id": "law", "lat": 38.053, "lng": -78.509299 }, "mathematics": { "id": "mathematics", "lat": 38.0323, "lng": -78.508299 }, "music": { "id": "music", "lat": 38.0329, "lng": -78.504899, "floors": ["1","2"], "entranceFloor": "2", "resolutionBounds": { "19": [[147812, 147813],[202171, 202172]], "20": [[295624, 295627],[404343, 404345]], "21": [[591249, 591254],[808686, 808690]] } }, "physics": { "id": "physics", "lat": 38.0341, "lng": -78.5099 }, "small": { "id": "small", "lat": 38.036231, "lng": -78.505787 } }, 
                         panos:{"table":{"cols":["id","spaceSlug","Name","Location","povheading","povpitch","povzoom","width","height","link1heading","link1desc","link1pano","floor","library","description","link2heading","link2desc","link2pano","longDescription"],"rows":[["alderman-out","","Alderman Library","38.03622896354395,-78.50542444113921",30,7,1,17810,6754,"38.03605150787215,-78.5048826349182","Alderman Crosswalk","ueslqzOd0MrsCaSkyPXaBg","","","Outside Alderman Library","","","",""],["small-out","","Harrison Institute and Small Special Collections Library","38.03606097059928,-78.50567623972893",-97,7,1,17850,6113,"38.035924753557616,-78.50494164351653","McCormick Road","bhGGLwTX2SRfpAlffmSVMA","","","Outside Harrison / Small Library","","","alderman/out",""],["clemons-out","","Clemons Entrance ","38.036342998125676,-78.50569233298302",140,7,1,17894,6041,"","Alderman Library","alderman/out","","","Outside Clemons Library","","","",""],["alderman-eclassrm","","Alderman Electronic Classroom","38.036594964509355,-78.50504960242938",50,7,1,13404,5179,"","","","4","alderman","","","","",""],["alderman-lobby","","Alderman Lobby","38.03643599461766,-78.50532251719665",80,7,1,13358,5222,"38.03622896354395,-78.50542444113921","Outside Alderman","alderman/out","4","alderman","","","","","Open, comfy, lively \u2026 andy you're never more than a few steps away from a fresh cup of coffee."],["alderman-ref","","Alderman Reference","38.036465570437564,-78.50498455886077",200,7,1,13412,5202,"38.03643599461766,-78.50532251719665","","alderman/lobby","4","alderman","","","","","Go old school. A traditional, quiet study space right in the heart of Library services."],["alderman-mcgreg","","McGregor Reading Room","38.03640905948647,-78.50500668708514",50,7,1,13400,5199,"","","","2","alderman","","","","","If Harry Potter had a favorite study place this would be it. Very quiet \u2026 often a little dark. A charming favorite."],["alderman-slab","","Scholars' Lab","38.03671907697553,-78.50549954299163",50,7,1,13422,5244,"","","alderman/lobby","4","alderman","","","","","High-end computing and dynamic collaboration in an open, contemporary setting\u2014a great place to get your tech on and feed off the energy around you."],["alderman-asiarm1","","Asian Reading Room","38.036538981796035,-78.50493829075526",50,7,1,13512,5249,"","","","2","alderman","","","","","Filled with Asian artwork and materials. A beautiful, quiet space with tons of natural light."],["alderman-gradrm","","Alderman Grad Room","","","","","","","","","","3","alderman","","","","",""]]} },
                         spaces:{}};

  var client = request.createClient('http://www.library.virginia.edu/');
  client.get('api/get_recent_posts/?dev=1&count=0&post_type=uvalib_study_space', function(err, res, body){
    library_listing['spaces'] = body; 

    client.get('api/get_recent_posts/?dev=1&count=0&post_type=uvalib_library', function(err, res, body){
      var libs = body.posts; 
      for (var i=0; i<libs.length; i++) {
        var lib = libs[i];
        if (lib.slug) {
          var obj = {id:lib.slug};
          if (lib.additional_info.feed_url)
            obj.feedURL=[lib.additional_info.feed_url];
          if (lib.additional_info.events_calendar_id)
            obj.eventscalendarid= lib.additional_info.events_calendar_id;
          if (lib.thumbnail)
            obj.thumb= lib.thumbnail;
          if (lib.additional_info.hours_calendar_id)
            obj.hourscalendarid= lib.additional_info.hours_calendar_id;
          if (lib.additional_info.donor_title)
            obj.donorTitle = lib.additional_info.donor_title;
          if (lib.additional_info.twitter_handle || lib.additional_info.facebook_url) {
            obj.socialLinks = {};
            if (lib.additional_info.twitter_handle)
              obj.socialLinks.twitter_handle = lib.additional_info.twitter_handle;
            if (lib.additional_info.facebook_url)
              obj.socialLinks.facebook_url = lib.additional_info.facebook_url;
          }
          if (lib.additional_info.phone_number)
            obj.phone = lib.additional_info.phone_number;
          if (lib.url)
            obj.link = lib.url;
          if (lib.title)
            obj.deptName = lib.title;
          if (lib.additional_info.email_address)
            obj.email = lib.additional_info.email_address;
          if (lib.library_type) {
            obj.categories = [];
            for (var j=0; j<lib.library_type.length; j++) {
              obj.categories.push(lib.library_type[j].name.toLowerCase());
            }
          }
          if (lib.content)             
            obj.description = lib.content;
          library_listing['directory']['allGroups'][lib.slug] = obj;
        }
      }
      console.log( JSON.stringify(library_listing) );
    });

  });

});
