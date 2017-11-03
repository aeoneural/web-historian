var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var statusCode = 200;
  var targetURL = archive.paths.archivedSites + req.url;

  var tempURls;
  
  
  if (req.method === 'GET') {
    //initialize the index.html
    if (req.url === '/') {
      targetURL = archive.paths.siteAssets + '/index.html';
      statusCode = 200;
      
      fs.readFile(targetURL, function(err, data) {
        res.writeHead(statusCode, httpHelpers.headers);       
        res.write(data);
        res.end();
      });
    } else { // if rec.url is not referring to the home page.
      // search for the file in the archive
      // console.log('URL ----> ', req.url);
      archive.isUrlArchived(req.url.slice(1), function(fileExists) { 
        // if it's in the archive, read and send it back. 
        if (fileExists) { 
          fs.readFile(targetURL, function(err, data) {
            res.writeHead(statusCode, httpHelpers.headers);       
            res.write(data);
            res.end();
          });
        } else {  // 404 when asked for a nonexistent file
          res.writeHead(404, httpHelpers.headers);       
          res.end();
        }

      });
    }
  } else if (req.method === 'POST') {

    var body = '';
    req.on('data', function (chunk) {
      body += chunk;
    });
    req.on('end', function () {
      var targetFile = body.slice(4);
      console.log('target ========>', targetFile);

      targetURL = archive.paths.archivedSites + '/' + targetFile;
      console.log('=====================>', targetURL);
      
      archive.isUrlArchived(targetFile, function(fileExists) { 
        // if it's in the archive, read and send it back. 
        
        console.log('EXISTS --->>', fileExists);
        if (fileExists) { 
          fs.readFile(targetURL, function(err, data) {
            if (err) { 
              throw err;
            }
            res.writeHead(302, httpHelpers.headers);       
            res.write(data);
            res.end();
          });
        } else {
          // add the URL to the sites.txt file
          archive.addUrlToList(targetFile, function() {
          });
          //respond with loading.html and update the sites.txt file
          fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
            res.writeHead(302, httpHelpers.headers);       
            res.write(data);
            res.end();
          });
        }

      });
        
    });
  } 


};