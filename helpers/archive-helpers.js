var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require("request");


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};
console.log('------> ', exports.paths.archivedSites);
// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// read the site.txt and run Callback
exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    var URLs = data.toString().split('\n');
    //console.log("---------> ", output); 
    callback(URLs);
  });
};

// use readListofUrls and check if URL is in the list, run CB
exports.isUrlInList = function(url, callback) {

  exports.readListOfUrls(function(URLs) {  
    var isInList = URLs.includes(url); // invoke sometimes in future
    callback(isInList); 
  });

};


exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(isInList) { 
    if (!isInList) { 
      fs.writeFile(exports.paths.list, url, function(err) {
        if (err) { 
          throw err;
        } else { 
          callback();
        }
      });
    }
  });
  
};


exports.isUrlArchived = function(url, callback) {
  //fs.readdir
  // first read the directory, 
    // check if url is in the array file 
  fs.readdir(exports.paths.archivedSites, function(err, files) { 
    // console.log('----> files', files);
    var isInDirectory = files.includes(url);
    callback(isInDirectory);
  });
  
  
  
};

exports.downloadUrls = function(urls) {
// iterate over the urls 
  // each time create new file with each url element name
    // make a get request 
    // write the body of the get request into the file 
  urls.forEach(function(url, i) {
    request({
      uri: 'https://' + url,
    }, function(error, response, body) {
      if (error) { throw error; }
      fs.writeFile(exports.paths.archivedSites + '/' + url, body, (err) => {
        if (err) {
          throw err;
        } 
      });
    });    
  });

};


