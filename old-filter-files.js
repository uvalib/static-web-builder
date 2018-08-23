var jsonKey = '/Users/dhc4z/Downloads/uvalib-api-firebase-adminsdk-urtjy-b407df0805.json'
//var jsonKey = '/home/bamboo/uvalib-api-firebase-adminsdk-urtjy-b407df0805.json'

var fbadmin = require('firebase-admin'),
    fbserviceAccount = require(jsonKey),
    cheerio = require('cheerio'),
    fs = require('fs'),
    dataIn = "",
    moment = require('moment'),
    imagemin = require('imagemin'),
    imageminJpegtran = require('imagemin-jpegtran'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminWebp = require('imagemin-webp'),
    im = require('imagemagick'),
    gstorage = require('@google-cloud/storage');
    request = require('request'),
    fbFiles = {};

var storage = gstorage({
  projectId: 'uvalib-api',
  keyFilename: jsonKey
});

var bucket = storage.bucket('uvalib-api.appspot.com');

/**
 * Connect & Setup of Firebase DB
 */
fbadmin.initializeApp({
  credential: fbadmin.credential.cert(fbserviceAccount),
  databaseURL: "https://uvalib-api.firebaseio.com"
});

var fbdb = fbadmin.database();
var filesRef = fbdb.ref('files');

console.log('attempt to get known files');

// Get all the known files from our api
filesRef.once("value", function(knownFiles){

  fbFiles = knownFiles.val();
  console.log('file count in db currently '+knownFiles.numChildren());

  process.stdin.resume();
  process.stdin.setEncoding('utf8')

  process.stdin.on('data', function(chunk) {
    dataIn += chunk;
  });

  // Read in from stdin (from drupal), then parse and start iterating recursivly
  process.stdin.on('end', function(){
    $ = cheerio.load(dataIn);
    var fileRows = $('.views-row').toArray();
    munchFileRows(fileRows)
  });

});

var getFilesizeInBytes = function(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

// Todo, skip known files that haven't been changed
var munchFileRows = function(fileRows){
  row = $( fileRows.shift() );
  var uuid = getValue(row, 'views-field-uuid');
  var file = {};
  file.uuid = uuid;
  file.name = getValue(row, 'views-field-filename');
  file.ext = '.'+file.name.replace(/.*\./,'');
  var href = $(row).find('.views-field-filename .field-content a').attr('href');
  file.type = getValue(row, 'views-field-filemime');
  file.created = getTime(row, 'views-field-created');
  file.changed = getTime(row, 'views-field-changed');

  if(fbFiles && fbFiles[uuid] && fbFiles[uuid].changed == file.changed) {
    continueProcessing(fileRows);
  } else {

    // download file for further processing
    download(href, uuid+file.ext, function(){
      saveToStorage(uuid+file.ext, uuid+file.ext, function(url) {
        file.origSrc = url;
        file.origSrcSize = getFilesizeInBytes(uuid+file.ext);
        console.log('original size: '+file.origSrcSize);
        continueProcessing(fileRows);
        //if this is an image get a thumb and tweek the image
//        if (file.type == "image/jpeg" || file.type == "image/png") {
//          console.log('make other versions of the image');
//          processImage(file, function(){ saveMeta(uuid, file, function(){continueProcessing(fileRows);} )});
//        //else just save file meta to firebase and continue
//        } else {
//          saveMeta(uuid, file, function(){continueProcessing(fileRows);});
//        }
      });
    });

  }
}

var saveToStorage = function(fin, name, callback){
  var inStream = fs.createReadStream(fin);
  var bucketFile = bucket.file(name);
  var bucketWriteStream = bucketFile.createWriteStream();
  inStream.pipe(bucketWriteStream).on('finish', function(){
    console.log('saved '+name+' to storage bucket');
    bucketFile.makePublic(function(){
      console.log('made '+name+' public');
      callback("https://storage.googleapis.com/uvalib-api.appspot.com/"+name);
    });
  });
}

var mkThumb = function(fin, callback){
  if (fs.existsSync(fin)) {
    console.log("making thumb out of "+fin);
    im.resize({srcPath:fin, dstPath:fin+'thumb',  width: 120}, function(err, stdout, stderr){
      if (err) throw err;
      callback();
    });
  } else { callback(''); }
}

var processImage = function(file, callback){

  // Optimize a version of this image (if possible)
  imagemin([file.uuid+file.ext], 'processedImages', {plugins: [imageminJpegtran(), imageminPngquant({quality: '65-80'})]})
    .then(function(){
      saveToStorage('processedImages/'+file.uuid+file.ext, file.uuid+'.comp'+file.ext, function(url) {
        file.compSrc = url;
        file.compSrcSize = getFilesizeInBytes('processedImages/'+file.uuid+file.ext);
        console.log('compressed size: '+file.compSrcSize);
        mkThumb('processedImages/'+file.uuid+file.ext, function(){
          saveToStorage('processedImages/'+file.uuid+file.ext+'thumb', file.uuid+'.thumb'+file.ext, function(url){
            file.thumbSrc = url;
            file.thumbSrcSize = getFilesizeInBytes('processedImages/'+file.uuid+file.ext+'thumb');
            console.log('thumb size: '+file.thumbSrcSize);
            // Make a webp image (expermental)
            im.convert([file.uuid+file.ext, "-quality", "75", "lossless", "true", 'processedImages/'+file.uuid+'.webp'],function(err,stdout){
              //if (fs.existsSync('processedImages/'+file.uuid+'.webp')) {
                saveToStorage('processedImages/'+file.uuid+'.webp', file.uuid+'.webp', function(url){
                    file.webpSrc = url;
                    file.webpSrcSize = getFilesizeInBytes('processedImages/'+file.uuid+'.webp');
                    console.log('webp size: '+file.webpSrcSize);
                    mkThumb('processedImages/'+file.uuid+'.webp', function(){
                      saveToStorage('processedImages/'+file.uuid+'.webp'+'thumb', file.uuid+'.thumb'+'.webp', function(url){
                        file.webpthumbSrc = url;
                        file.webpthumbSrcSize = getFilesizeInBytes('processedImages/'+file.uuid+'.webp'+'thumb');
                        console.log('webp thumb size: '+file.webpthumbSrcSize);
                        callback();
                      });
                    });
                });
              //} else callback();
            });

          });

        });
      });
    })
    // Something happened just trigger the callback
    .catch(function(err){
      console.log(err);
      callback();
    });
}

var saveMeta = function(uuid, file, callback){
//  var fileRef = filesRef.child(uuid);
//  fileRef.set(file, function(){
//    console.log('downloaded file and saved meta for '+uuid);
//    callback();
//  });
}

var continueProcessing = function(fileRows){
  console.log(fileRows.length+" files left to process");
  // continue munching if there are more
  if (fileRows.length > 0)
    munchFileRows(fileRows);
  // or exit
  else
    exit();
}

var getTime = function(context, name){
  var datestring = getValue(context, name);
  return moment(datestring, "ddd, MM/DD/YYYY - HH:mm").unix();
}

var getValue = function(context, name){
  return $(context).find('.'+name+' .field-content').text().replace(/^\s+|\s+$/g,'');
}

var exit = function(){
//  fbdb.goOffline();
  console.log('bye bye');
  process.exit(0);
}

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    if (!res) console.log(err);
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
