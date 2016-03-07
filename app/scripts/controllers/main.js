'use strict';
angular.module('noiseComplaintsApp')
.controller('MainCtrl', function ($scope, $location, $anchorScroll, $timeout, $http, $mdDialog) {
  $scope.complaintTypes = [
    {label: 'Loud Music'},
    {label: 'Crowd/Voices'},
    {label: 'Bass Effect'},
    {label: 'Other'}
  ];
  $scope.scrollTo = function (div) {
    $timeout(function () {
      $anchorScroll(div);
    });
  };
  $scope.showAlert = function(ev) {
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.querySelector('#container')))
      .clickOutsideToClose(true)
      .title('Disclaimer')
      .content('Information submitted on the Online HDEP Complaint Form is a public record and will be shared with the Police Department, bar/club management and neighborhood leaders.')
      .ariaLabel('Disclaimer')
      .ok('Got it!')
    );
  };
  $scope.submitForm = function (complaintant, establishment) {
    console.log(establishment.OBJECTID);
    console.log(complaintant);
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
        MUSIC: complaintant.music,
        CROWD: complaintant.crowd,
        BASS: complaintant.bass,
        OTHER_TYPE: complaintant.other           
      }}
    ]];

    var data = {
      features: features,
      f: 'json'
    };
    $http({
      url:'http://giststapplv1:6080/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/2/addFeatures',
      method:"POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: data
    }).then(function (e) { 
      console.log(e);
      $scope.establishment = null;
      $scope.complaintant = null;         
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
    'dojo/dom-construct',
    'dojo/domReady!'
  ], function(Map, VectorTileLayer, FeatureLayer, Popup, PopupTemplate, on, domConstruct) {
    //var popup = new Popup({}, domConstruct.create('div'));
    
    var map = new Map('map', {
      center: [-78.646, 35.785],
      zoom: 14/*,
      infoWindow: popup*/
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
  var businesses = new FeatureLayer('http://mapstest.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0',
  { mode: FeatureLayer.MODE_SNAPSHOT,
    infoTemplate: template,
    outFields: ['*']});
    map.addLayer(businesses);
    $scope.establishments = [];
    on(businesses, 'graphic-add', function (e) {
      $scope.establishments.push(e.graphic.attributes);
      $scope.$apply();
      console.log($scope.establishments);
    });
  });    
});