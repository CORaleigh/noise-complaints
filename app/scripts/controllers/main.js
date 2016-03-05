'use strict';

/**
 * @ngdoc function
 * @name noiseComplaintsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the noiseComplaintsApp
 */
angular.module('noiseComplaintsApp')
  .controller('MainCtrl', function ($scope, $location, $anchorScroll, $timeout, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    this.question2 = false;
    this.question3 = false;
    this.question4 = false;
    this.question5 = false;
    this.question6 = false;  
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
            RESOLVED: complaintant.question6            
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
          $scope.question2 = false;
          $scope.question3 = false;
          $scope.question4 = false;
          $scope.question5 = false;
          $scope.question6 = false;           
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

      //Create a map object
      var popup = new Popup({}, domConstruct.create('div'));

      var map = new Map('map', {
        center: [-78.646, 35.785],
        zoom: 14,
        infoWindow: popup
      });

      //make map view and bind it to the m

      /********************************************************************  
       * Add a tile layer to the map
       * 
       * The url parameter must either point to the style as 
       * demonstrated below or to the URL of a Vector Tile service 
       * such as: 
       * 
       * https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap/VectorTileServer
       *********************************************************************/
      var tileLyr = new VectorTileLayer('http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json'
      );
      map.addLayer(tileLyr);
      var district = new FeatureLayer('http://giststapplv1:6080/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/1');
      map.addLayer(district);

      var template = new PopupTemplate({
        title: '{ESTABLISHMENT}',
        description: '<button class="btn btn-primary">File Complaint</button>'
      });
      var businesses = new FeatureLayer('http://giststapplv1:6080/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0',
        { mode: FeatureLayer.MODE_SNAPSHOT,
          infoTemplate: template,
          outFields: ['*']});
      map.addLayer(businesses);
      $scope.establishments = [];
      on(businesses, 'graphic-draw', function (e) {
        $scope.establishments.push(e.graphic.attributes);
        $scope.$apply();
        console.log($scope.establishments);
      });

/* 		var template = new PopupTemplate({
        	title: '{ESTABLISHMENT}', 
	       	content: '{ESTABLISHMENT}'      	     	     
        });
		var district = new FeatureLayer({
          url: 'http://giststapplv1:6080/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/1'
        });

        map.add(district); 
        district.then(function () {
        view.extent = district.fullExtent; 
       	});          
        var businesses = new FeatureLayer({
          url: 'http://giststapplv1:6080/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0',
          outFields: ['*'],
          popupTemplate: template
        });

        map.add(businesses);    
        businesses.on("layer-view-create", function(evt){
          //The LayerView for the layer that emitted this event
          console.log(evt.layerView.getGraphics());
        });*/
    });    
  });
