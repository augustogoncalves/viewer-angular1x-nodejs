/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict'; // http://www.w3schools.com/js/js_strict.asp

// web framework
var express = require('express');
var router = express.Router();

// forge config information, such as client ID and secret
var config = require('./config');

// make requests for tokens
var token = require('./forge.token');

// forge
var ForgeOSS = require('forge-oss');


// this end point will forgeLogoff the user by destroying the session
// as of now there is no Forge endpoint to invalidate tokens
router.get('/forge/oauth/token', function (req, res) {
  var t = new token();
  t.getTokenInternal(function (tokenPublic) {
    res.status(200).end(tokenPublic);
  })
});

router.get('/forge/models', function (req, res) {
  var t = new token();
  t.getTokenInternal(function (tokenInternal) {
    var ossClient = ForgeOSS.ApiClient.instance;
    var ossOAuth = ossClient.authentications ['oauth2_application']; // not the 'oauth2_access_code', as per documentation
    ossOAuth.accessToken = tokenInternal;
    var buckets = new ForgeOSS.BucketsApi();
    var objects = new ForgeOSS.ObjectsApi();

    buckets.getBuckets({limit: 100}).then(function (data) {
      var models = {};
      var count = data.items.length;
      data.items.forEach(function (bucket) {
        objects.getObjects(bucket.bucketKey).then(function (data) {
          count--;
          console.log(count + ' - ' + bucket.bucketKey); // log all buckets found
          data.items.forEach(function (object) {
            models[object.objectKey] = 'urn:' + object.objectId.toBase64();
          });
          if (count==0)
            res.status(200).json(models);
        });
      });
    });
  });
});

String.prototype.toBase64 = function () {
  return new Buffer(this).toString('base64');
};

module.exports = router;