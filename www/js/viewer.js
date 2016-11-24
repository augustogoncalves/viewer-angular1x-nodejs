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

'use strict';

angular.module('ngViewerDemo')
  .directive('ngwebgl', function () {

    return {
      restrict: 'A',
      scope: {
        'lightPreset': '=',
        'modelsName': '='
      },
      link: function postLink(scope, element, attrs) {

        // this will execute immediately, giving us our
        // first viewer instance using the default values
        scope.$watch('modelsName', function () {
          viewit(scope.modelsName, scope.lightPreset);
        });

        scope.$watch('lightPreset', function () {
          if (viewer != null && viewer.model != null) {
            viewer.setLightPreset(scope.lightPreset);
          }
        });
      }
    };
  });


// global viewer
var viewer;

// setup a new model in the viewer
function viewit(modelName, lightPreset) {
  if (!modelName) return;

  var appElement = document.querySelector('[ng-app=ngViewerDemo]');
  var appScope = angular.element(appElement).scope();
  var controllerScope = appScope.$$childHead;
  var models = controllerScope.models;

  var options = {
    'document': modelName,
    'env': (modelName.indexOf('urn') == 0 ? 'AutodeskProduction' : 'Local'),
    'getAccessToken': getForgeToken,
    'refreshToken': getForgeToken
  };
  var viewerElement = document.getElementById('viewer');
  // this version of viewer does not have navigation bar by default
  //var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});
  // this version of viewer has the navigation bar by default
  viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});

  Autodesk.Viewing.Initializer(options, function () {
    viewer.initialize();
    loadDocument(options);
    viewer.setLightPreset(lightPreset);
  });
}

function loadDocument(options) {
  if (options.env == 'Local')
    viewer.load(options.document);
  else {
    Autodesk.Viewing.Document.load(
      options.document,
      function (doc) { // onLoadCallback
        var geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
          'type': 'geometry',
        }, true);
        if (geometryItems.length > 0) {
          viewer.load(doc.getViewablePath(geometryItems[0])); // show 1st view on this document...
        }
      },
      function (errorMsg) { // onErrorCallback
        console.log(errorMsg);
      }
    )
  }
}

// tell the viewer to fit the geometry to the view extents.
function fit() {
  if (viewer != null) {
    viewer.fitToView();
  }
}

function getForgeToken() {
  var token = '';
  jQuery.ajax({
    url: '/forge/oauth/token',
    success: function (res) {
      token = res;
    },
    async: false // this request must be synchronous for the Forge Viewer
  });
  if (token != '') console.log('2 legged token: ' + token); // debug
  return token;
}