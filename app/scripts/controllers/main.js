'use strict';
angular.module('noiseComplaintsApp')
.controller('MainCtrl', function ($scope, $location, $anchorScroll, $timeout, $http, $mdDialog, $window) {
  var businesses = null, map = null;
  $scope.complaintTypes = [
    {label: 'Loud Music'},
    {label: 'Crowd/Voices'},
    {label: 'Bass Effect'},
    {label: 'Other'}
  ];
  $scope.maxDate = moment();
  $scope.scrollTo = function (div) {
    $timeout(function () {
      $anchorScroll(div);
    });
  };
  $scope.showSplash = function (ev, message, title) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#container')))
      .clickOutsideToClose(true)
      .title(title)
      .content(message)
      .ariaLabel(title)
      .ok('Continue')
    );
  };
  $scope.showSuccess = function(ev, message, title) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#container')))
      .clickOutsideToClose(true)
      .title(title)
      .content(message)
      .ariaLabel(title)
      .ok('Okay')
    ).finally(function() {
      $window.location.reload();
    });
  };
  $scope.zoomToBusiness = function (establishment) {
    $scope.establishment = establishment;
    map.centerAndZoom(establishment.geometry, 19);
  };

  var sendEmail = function () {
    var emailContent = "Establishment: " + $scope.establishment.attributes.ESTABLISHMENT + "\n" + "Complaintant Name: " + $scope.complaintant.name + "\n" + "Complaintant Phone: " + $scope.complaintant.phoneNumber + "\n" + "Complaintant Email: " + $scope.complaintant.email  + "\n" + "Date: " + moment($scope.complaintant.date).format('MM/DD/YYYY')  + "\n" + "Time: " + moment($scope.complaintant.time).format('hh:mm a') + "\n" + "Loud Music: " + (($scope.complaintant.music) ? 'Yes' : 'No') + "\n" + "Crowd/Voices: " + (($scope.complaintant.crowd) ? 'Yes' : 'No') + "\n" + "Bass Effect: " + (($scope.complaintant.bass) ? 'Yes' : 'No') + "\n" + "Other: " + (($scope.complaintant.other) ? 'Yes' : 'No')+ "\n" + "Prior to filing this complaint did you contact the establishment?: " + $scope.complaintant.question4 + "\n" + "Did you speak with a member of management?: " + $scope.complaintant.question5 + "\n" + "Was your complaint resolved?: " + $scope.complaintant.question6;
    var data = {from:"Hospitality District",fromEmail:"Hospitality@raleighnc.gov",to:"noiseofficer", toEmail:"justin.greco@raleighnc.gov",message:emailContent,subject:"Hospitality District - online complaint"};
    $http({
      url:'http://maps.raleighnc.gov/php/mail.php',
      method:"POST",
      params: data
    }).then(function (e) {     $scope.showSuccess(e, "Your complaint has been successfully sent!", "Submitted Successfully"); });
    clearForm();
  };

  var clearForm = function () {
    $scope.establishment = null;
    $scope.complaintant.name = '';
    $scope.complaintant.phoneNumber = '';
    $scope.complaintant.email = '';
    $scope.complaintant.date = '';
    $scope.complaintant.time = '';
    $scope.complaintant.question4 = '';
    $scope.complaintant.question5 = '';
    $scope.complaintant.question6 = '';
    $scope.complaintant.music = '';
    $scope.complaintant.crowd = '';
    $scope.complaintant.bass = '';
    $scope.complaintant.other = '';
    $scope.complaintForm.$setPristine();
    $scope.complaintForm.complaintant.$touched = false;
    $scope.scrollTo('map');
  };

  $scope.submitForm = function (complaintant, establishment) {
    var features = [[
      {attributes: {
        BUSINESSOID: establishment.OBJECTID,
        NAME: complaintant.name,
        PHONE: complaintant.phoneNumber,
        EMAIL: complaintant.email,
        OCCUR_DATE: complaintant.date.getTime(),
        OCCUR_TIME: moment(complaintant.time).format('hh:mm a'),
        CONTACTED: complaintant.question4,
        SPOKE: complaintant.question5,
        RESOLVED: complaintant.question6,
        MUSIC: ((complaintant.music) ? 'Yes' : 'No'),
        CROWD: ((complaintant.crowd) ? 'Yes' : 'No'),
        BASS: ((complaintant.bass) ? 'Yes' : 'No'),
        OTHER_TYPE: ((complaintant.other  ) ? 'Yes' : 'No')
      }}
    ]];

    var data = {
      features: features,
      f: 'json'
    };
    $http({
      url:'http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/2/addFeatures',
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: data
    }).then(function (e) {
      $timeout(function () {
        sendEmail();
      });
    }
    , function (e) {
      console.log(e);
    });
  };
  require([
    'esri/map',
    'esri/layers/VectorTileLayer',
    'esri/layers/FeatureLayer',
    'esri/dijit/Popup',
    'esri/dijit/PopupTemplate',
    'dojo/on',
    'esri/renderers/SimpleRenderer',
    'dojo/dom-construct',
    'dojo/domReady!'
  ], function(Map, VectorTileLayer, FeatureLayer, Popup, PopupTemplate, on, SimpleRenderer, domConstruct) {
    map = new Map('map', {
      center: [-78.646, 35.785],
      zoom: 14
    });
    var tileLyr = new VectorTileLayer('http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json'
  );
  map.addLayer(tileLyr);
  var district = new FeatureLayer('http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/1');
  map.addLayer(district);
  var template = new PopupTemplate({
    title: '{ESTABLISHMENT}',
    description: '<md-content><md-button class="md-raised md-primary">File Complaint</md-button></md-content>'
  });
  businesses = new FeatureLayer('http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0',
  { mode: FeatureLayer.MODE_SNAPSHOT,
    outFields: ['*']});
    map.addLayer(businesses);
    $scope.establishments = [];
    on(businesses, 'graphic-add', function (e) {
      $scope.establishments.push({attributes: e.graphic.attributes, geometry: e.graphic.geometry});
      $scope.$apply();
    });
    on(businesses, 'click', function (e) {
      console.log(e);
      for (var i = 0; i < $scope.establishments.length; i++) {
        if (e.graphic.attributes === $scope.establishments[i].attributes) {
          $scope.establishment = $scope.establishments[i];
        }
      }
      map.centerAndZoom(e.graphic.geometry, 19);
      $scope.scrollTo('question2');
      $scope.$apply();
    });
    businesses.setRenderer(new SimpleRenderer({
      "type": "simple",
      "label": "",
      "description": "",
      "symbol": {
        "color": [255, 0, 0, 203],
        "size": 8,
        "angle": 0,
        "xoffset": 0,
        "yoffset": 0,
        "type": "esriSMS",
        "style": "esriSMSCircle",
        "outline": {
          "color": [255, 255, 255, 255],
          "width": 0.99975,
          "type": "esriSLS",
          "style": "esriSLSSolid"
        }
      }}));
    });
  });