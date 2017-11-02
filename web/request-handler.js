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
  if (req.url === '/') {
    targetURL = archive.paths.siteAssets + '/index.html';
  }

  // if url archived does not exist -> return 404 
    // statuscode = 404  
  //archive.readListOfUrls();
  var tempURls;
  if (req.method === 'GET') {
   

    // fs.readdir(archive.paths.siteAssets, function(err, files) {
    //   tempURls = files;
    //   if (!tempURls.includes(req.url)) { 
    //     res.writeHead(404, httpHelpers.headers);
    //     res.end();
    //   }
    // });

    // Get list of fileNames in archives
        //check if the req.url is in the list
        // Y -> write the HTML into the body of the response
          // send back the response
        // N -> set the Status code to 400
    archive.readListOfUrls( function(files) {
      console.log(files);
    });


    fs.readFile(targetURL, function(err, data) {
      res.writeHead(statusCode, httpHelpers.headers);       
      //console.log('data------> ', data);
      
      res.write(data);
      res.end();

    });
  }
};
