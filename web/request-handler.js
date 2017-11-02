var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var statusCode = 200;
  //the targetURL for any request
  var targetURL = archive.paths.archivedSites + req.url;
  
  // if you don't have a url requested -> return index.html

  // if url archived does not exist -> return 404 
    // statuscode = 404  
  //archive.readListOfUrls();
  var tempURls;
  if (req.method === 'GET') {

    // Get list of fileNames in archives
        //check if the req.url is in the list
        // Y -> write the HTML into the body of the response
          // send back the response
        // N -> set the Status code to 400

    

    if (req.url === '/') {
      targetURL = archive.paths.siteAssets + '/index.html';
      statusCode = 200;
    } else {
      // check if url in archive!
        // e.g /www.google.com
      archive.isUrlArchived(req.url, function(fileExists) {
        // no idea when this will run...
        if (!fileExists) {
          statusCode = 404;
        }
        // if found, run readFile to nab the index html
        // else, send back loading.html
      });
    }
    //*******
    // RUN THIS INSIDE THE CALLBACK WHEN isURl achieved is finished running 
    fs.readFile(targetURL, function(err, data) {
      res.writeHead(statusCode, httpHelpers.headers);       
      //console.log('data------> ', data);
      
      res.write(data);
      res.end();

    });
  }
  // event hash - when isUrlArhived is done, run anon function // 16 ms
    // - when readFile is done, run anon function passed to it // 18 ms

// event hash - when isUrlArhived is done, run anon function // 16 ms
    // that runs readFile, then run anon function passed to it // 18 ms

    
};
