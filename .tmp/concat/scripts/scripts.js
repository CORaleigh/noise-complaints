'use strict';

/**
 * @ngdoc overview
 * @name noiseComplaintsApp
 * @description
 * # noiseComplaintsApp
 *
 * Main module of the application.
 */
angular
  .module('noiseComplaintsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ngMessages'
  ])
  .config(["$routeProvider", "$httpProvider", "$mdThemingProvider", function ($routeProvider, $httpProvider, $mdThemingProvider) {
  // $mdThemingProvider.theme('default')
  //   .dark();
$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      }).otherwise({
        redirectTo: '/'
      });
  }]);

'use strict';
angular.module('noiseComplaintsApp')
.controller('MainCtrl', ["$scope", "$location", "$anchorScroll", "$timeout", "$http", "$mdDialog", "$window", function ($scope, $location, $anchorScroll, $timeout, $http, $mdDialog, $window) {
  var businesses = null, map = null;
  $scope.complaintTypes = [
    {label: 'Loud Music'},
    {label: 'Crowd/Voices'},
    {label: 'Bass Effect'},
    {label: 'Other'}
  ];
  $scope.maxDate = new Date();//moment();
  $scope.scrollTo = function (div) {
    $timeout(function () {
      $anchorScroll(div);
    });
  };
  $scope.hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  $scope.minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40','45', '50', '55'];
  $scope.ampms = ['am', 'pm'];
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
    var emailContent = "Establishment: " + $scope.establishment.attributes.ESTABLISHMENT + "\n" + "Complaintant Name: " + $scope.complaintant.name + "\n" + "Complaintant Phone: " + $scope.complaintant.phoneNumber + "\n" + "Complaintant Email: " + $scope.complaintant.email  + "\n" + "Date: " + ($scope.complaintant.date.getMonth() + 1) + '/' + $scope.complaintant.date.getDate() + '/' + $scope.complaintant.date.getFullYear()  + "\n" + "Time: " + $scope.complaintant.time.hour + ':' + $scope.complaintant.time.minute + ' ' + $scope.complaintant.time.ampm + "\n" + "Loud Music: " + (($scope.complaintant.music) ? 'Yes' : 'No') + "\n" + "Crowd/Voices: " + (($scope.complaintant.crowd) ? 'Yes' : 'No') + "\n" + "Bass Effect: " + (($scope.complaintant.bass) ? 'Yes' : 'No') + "\n" + "Other: " + (($scope.complaintant.other) ? 'Yes' : 'No')+ "\n" + "Prior to filing this complaint did you contact the establishment?: " + $scope.complaintant.question4 + "\n" + "Did you speak with a member of management?: " + $scope.complaintant.question5 + "\n" + "Was your complaint resolved?: " + $scope.complaintant.question6;
    var data = {from:"Hospitality District",fromEmail:"Hospitality@raleighnc.gov",to:"noiseofficer", toEmail:"Noise.Officer@raleighnc.gov,gis@raleighnc.gov",message:emailContent,subject:"Hospitality District - online complaint"};
    $http({
      url:'https://maps.raleighnc.gov/php/mail.php',
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

  $scope.question4Answered = function () {
    if ($scope.complaintant.question4 == 'Yes') {
      $scope.scrollTo('question5');
      $scope.complaintant.question5 = '';
      $scope.complaintant.question6 = '';
    } else {
      $scope.scrollTo('submitButton');
      $scope.complaintant.question5 = 'No';
      $scope.complaintant.question6 = 'No';
    }
  }
  $scope.question5Answered = function () {
    if ($scope.complaintant.question4 == 'Yes') {
      $scope.scrollTo('question6');
      $scope.complaintant.question6 = '';
    } else {
      $scope.scrollTo('submitButton');
      $scope.complaintant.question6 = 'No';
    }
  }
  $scope.submitForm = function (complaintant, establishment) {
    var features = [[
      {attributes: {
        BUSINESSOID: establishment.attributes.OBJECTID,
        ESTABLISHMENT: establishment.attributes.ESTABLISHMENT,
        NAME: complaintant.name,
        PHONE: complaintant.phoneNumber,
        EMAIL: complaintant.email,
        OCCUR_DATE: complaintant.date,
        OCCUR_TIME: complaintant.time.hour + ':' + complaintant.time.minute + ' ' + complaintant.time.ampm,//moment(complaintant.time).format('hh:mm a'),
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
      url:'https://maps.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/2/addFeatures',
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
    'dijit/TooltipDialog',
    'dijit/popup',
    'dojo/dom-construct',
    'esri/dijit/LocateButton',
    'dojo/domReady!'
  ], function(Map, VectorTileLayer, FeatureLayer, Popup, PopupTemplate, on, SimpleRenderer, TooltipDialog, dijitPopup, domConstruct, LocateButton) {
    map = new Map('map', {
      center: [-78.646, 35.785],
      zoom: 14,
      logo: false
    });

  var tileLyr = new VectorTileLayer('http://tiles.arcgis.com/tiles/v400IkDOw1ad7Yad/arcgis/rest/services/Vector_Tile_Basemap/VectorTileServer/resources/styles/root.json');
  map.addLayer(tileLyr);
  var district = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/1');
  map.addLayer(district);
  var template = new PopupTemplate({
    title: '{ESTABLISHMENT}',
    description: '<md-content><md-button class="md-raised md-primary">File Complaint</md-button></md-content>'
  });

  businesses = new FeatureLayer('https://maps.raleighnc.gov/arcgis/rest/services/Police/HospitalityDistrict/FeatureServer/0',
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

    // Show park name on hover
    var tooltip = new TooltipDialog({ id: "tooltip"});
    tooltip.startup();
    on(businesses, 'mouse-over', showTooltip);
    on(businesses, 'mouse-out', hideTooltip);
    on(map, 'pan', hideTooltip);

    function showTooltip(evt) {
      var content = evt.graphic.attributes.ESTABLISHMENT + '<br/>' + evt.graphic.attributes.ADDRESS ;
      tooltip.setContent(content);
      dijitPopup.open({
        popup: tooltip,
        x: evt.pageX + 10,
        y: evt.pageY + 10
      });
      return false;
    }
    function hideTooltip(evt) {
      dijitPopup.close(tooltip);
    }
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
      // var geoLocate = new LocateButton({
      //   map: map
      // }, "LocateButton");
      // geoLocate.startup();
    });
  }]);

angular.module('noiseComplaintsApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/main.html',
    "<div ng-init=\"showSplash($event, 'Information submitted on the Online HDEP Complaint Form is a public record.', 'Disclaimer')\"> <md-toolbar md-scroll-shrink> <div class=\"md-toolbar-tools\">Online Noise Complaint Form</div> </md-toolbar> <div class=\"\"> <div id=\"map\" style=\"height:300px; width:100%\"><div id=\"LocateButton\"></div><div id=\"tooltip\"></div></div> </div> <div flex layout-padding layout-align=\"center center\"> <div id=\"question1\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">1. Select an Establishment</h2> <md-input-container> <label>Establishment</label> <md-select ng-model=\"establishment\" ng-change=\"scrollTo('question2');zoomToBusiness(establishment);\"> <md-option ng-repeat=\"establishment in establishments  | orderBy: 'attributes.ESTABLISHMENT' track by establishment.attributes.ESTABLISHMENT\" ng-value=\"establishment\"> {{establishment.attributes.ESTABLISHMENT}} </md-option> </md-select> </md-input-container> </div> <div id=\"question2\" ng-show=\"establishment\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">2. To resolve your complaint the City of Raleigh encourages you to contact the business directly at</h2> <a ng-href=\"tel:1-{{establishment.attributes.PHONE}}\"><h2>{{establishment.attributes.PHONE}}</h2></a> <span class=\"md-body-2\">(Contact {{establishment.attributes.CONTACT}})</span> <span class=\"alert911\"> If this is an emergency please call 911 </span> <md-button class=\"md-raised md-primary\" ng-click=\"complaintant.question2 = true;scrollTo('question3');\">Continue with Online Complaint</md-button> </div> <div id=\"question3\" ng-show=\"complaintant.question2\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">3. Fill out the following form</h2> <form name=\"complaintForm\"> <md-input-container class=\"md-block\"> <label>Your Name</label> <input required name=\"complaintant\" ng-model=\"complaintant.name\" md-maxlength=\"50\"> <div ng-messages=\"complaintForm.complaintant.$error\"> <div ng-message=\"required\">This is required.</div> </div> </md-input-container> <md-input-container class=\"md-block\" flex-gt-sm> <label>Phone Number</label> <input name=\"phone\" ng-model=\"complaintant.phoneNumber\" ng-pattern=\"/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/\" md-maxlength=\"12\"> <div class=\"hint\" ng-show=\"showHints\">###-###-####</div> <div ng-messages=\"complaintForm.phone.$error\" ng-hide=\"showHints\"> <div ng-message=\"pattern\">###-###-#### - Please enter a valid phone number.</div> </div> </md-input-container> <md-input-container class=\"md-block\"> <label>Your Email</label> <input required type=\"email\" name=\"complaintantEmail\" ng-model=\"complaintant.email\" minlength=\"10\" maxlength=\"50\" ng-pattern=\"/^.+@.+\\..+$/\" md-maxlength=\"50\"> <div ng-messages=\"complaintForm.complaintantEmail.$error\" role=\"alert\"> <div ng-message-exp=\"['required', 'minlength', 'maxlength', 'pattern']\"> Your email must be between 10 and 50 characters long and look like an e-mail address. </div> </div> </md-input-container> <md-content> <md-datepicker id=\"date\" name=\"date\" ng-model=\"complaintant.date\" md-min-date=\"minDate\" md-max-date=\"maxDate\"></md-datepicker> <div ng-messages=\"complaintForm.date.$error\"> <div ng-message=\"required\">This is required.</div> </div> </md-content> <div class=\"row\" align=\"center center\"> <md-input-container> <label>Hour</label> <md-select ng-model=\"complaintant.time.hour\" required> <md-option ng-repeat=\"hour in hours\" ng-value=\"hour\"> {{hour}} </md-option> </md-select> <div ng-messages=\"complaintForm.date.$error\"> <div ng-message=\"required\">This is required.</div> </div> </md-input-container> <md-input-container> <label>Minute</label> <md-select ng-model=\"complaintant.time.minute\" required> <md-option ng-repeat=\"minute in minutes\" ng-value=\"minute\"> {{minute}} </md-option> </md-select> <div ng-messages=\"complaintForm.date.$error\"> <div ng-message=\"required\">This is required.</div> </div> </md-input-container> <md-input-container> <label>am/pm</label> <md-select ng-model=\"complaintant.time.ampm\" required> <md-option ng-repeat=\"ampm in ampms\" ng-value=\"ampm\"> {{ampm}} </md-option> </md-select> <div ng-messages=\"complaintForm.date.$error\"> <div ng-message=\"required\">This is required.</div> </div> </md-input-container> </div> <br> <div layout=\"column\"> <md-checkbox ng-model=\"complaintant.music\"> Loud Music </md-checkbox> <md-checkbox ng-model=\"complaintant.crowd\"> Crowd/Voices </md-checkbox> <md-checkbox ng-model=\"complaintant.bass\"> Bass Effect </md-checkbox> <md-checkbox ng-model=\"complaintant.other\"> Other </md-checkbox> </div> </form> <md-button ng-disabled=\"complaintForm.$invalid\" ng-click=\"complaintant.question3 = true;scrollTo('question4')\" class=\"md-raised md-primary\">Continue</md-button> </div> <div id=\"question4\" ng-show=\"complaintant.question3 || complaintForm.input.$error\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">4. Prior to filing this complaint did you contact the establishment?</h2> <md-radio-group ng-model=\"complaintant.question4\" ng-click=\"question4Answered()\"> <md-radio-button value=\"Yes\" class=\"md-primary\">Yes</md-radio-button> <md-radio-button value=\"No\"> No </md-radio-button> </md-radio-group> </div> <div id=\"question5\" ng-show=\"complaintant.question4 =='Yes'\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">5. Did you speak with a member of management?</h2> <md-radio-group ng-model=\"complaintant.question5\" ng-click=\"question5Answered()\"> <md-radio-button value=\"Yes\" class=\"md-primary\">Yes</md-radio-button> <md-radio-button value=\"No\"> No </md-radio-button> </md-radio-group> </div> <div id=\"question6\" ng-show=\"complaintant.question5 =='Yes'\" layout-align=\"center center\" layout=\"column\"> <h2 class=\"md-title\">6. Was your complaint resolved?</h2> <md-radio-group ng-model=\"complaintant.question6\" ng-click=\"scrollTo('submitButton')\"> <md-radio-button value=\"Yes\" class=\"md-primary\">Yes</md-radio-button> <md-radio-button value=\"No\"> No </md-radio-button> </md-radio-group> </div> <div layout-align=\"center center\" layout=\"row\" ng-show=\"complaintant.question6 || complaintant.question5 == 'No' || complaintant.question4 == 'No'\"> <md-button id=\"submitButton\" class=\"md-raised md-primary\" ng-click=\"submitForm(complaintant, establishment)\">Submit</md-button> </div> </div> </div>"
  );

}]);
