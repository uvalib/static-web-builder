//var gcloud = require('gcloud');
var gstorage = require('@google-cloud/storage');
var request = require('request');
var fs = require('fs');
var stream = require('stream');
var banners = require('./filtered-banners.json');

var storage = gstorage({
  projectId: 'uvalib-api',
  keyFilename: '/home/teamcity/build-deploy-scripts/json-web-tokens/uvalib-api-firebase-adminsdk-urtjy-b407df0805.json'
});

var bucket = storage.bucket('uvalib-api.appspot.com');

// Phone images
var promises = banners.map(function(banner){
  return new Promise(function(resolve, reject) {
    //phone
    var fileExt = banner.phoneImage.url.split('.').pop();
    var localName = banner.phoneImage.uuid+'.'+fileExt;
    var bucketFile = bucket.file(localName);
    var bucketWriteStream = bucketFile.createWriteStream();
    var instream = request(banner.phoneImage.url);
    banner.phoneImage.url="https://storage.googleapis.com/uvalib-api.appspot.com/"+localName;
    var bF = bucket.file(localName);
    instream.pipe(bucketWriteStream).on('finish', function(){bF.makePublic(resolve)});
  });
});
promises = promises.concat(banners.map(function(banner){
  return new Promise(function(resolve, reject) {
    //tablet
    var fileExt = banner.tabletImage.url.split('.').pop();
    var localName = banner.tabletImage.uuid+'.'+fileExt;
    var bucketFile = bucket.file(localName);
    var bucketWriteStream = bucketFile.createWriteStream();
    var instream = request(banner.tabletImage.url);
    banner.tabletImage.url="https://storage.googleapis.com/uvalib-api.appspot.com/"+localName;
    var bF = bucket.file(localName);
    instream.pipe(bucketWriteStream).on('finish', function(){bF.makePublic(resolve)});
  });
}));

promises = promises.concat(banners.map(function(banner){
  return new Promise(function(resolve, reject) {
    //desktop
    var fileExt = banner.desktopImage.url.split('.').pop();
    var localName = banner.desktopImage.uuid+'.'+fileExt;
    var bucketFile = bucket.file(localName);
    var bucketWriteStream = bucketFile.createWriteStream();
    var instream = request(banner.desktopImage.url);
    banner.desktopImage.url="https://storage.googleapis.com/uvalib-api.appspot.com/"+localName;
    var bF = bucket.file(localName);
    instream.pipe(bucketWriteStream).on('finish', function(){bF.makePublic(resolve)});
  });
}));

Promise.all(promises)
       .then(function(){
         console.log(JSON.stringify(banners));
        })
