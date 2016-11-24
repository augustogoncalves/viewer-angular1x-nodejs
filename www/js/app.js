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

angular.module('ngViewerDemo', [])
  .controller('AppCtrl', function ($scope, $http) {
    $scope.models = [];

    $http({
      method: 'GET',
      url: '/forge/models'
    }).success(function (result) {
      $scope.models = result;

      // aslo add a few local models...
      $scope.models["robot"] = './models/InventorRobot/0.svf';
      $scope.models["house"] = './models/RevitHouse/1.svf';
      $scope.models["watch"] = './models/FusionWatch/0/1/Design.svf';
      $scope.models["drone"] = './models/FusionDrone/0/1/Design.svf';
      $scope.models["car"] = './models/FusionCar/0/1/Design.svf';
    });

    $scope.fittoview = function () {
      fit();
    }

  });