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
    'ngTouch',
    'ngMaterial',
    'ngMaterialDatePicker',
    'ngMessages'
  ]).config(function ($routeProvider, $httpProvider) {  
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      }).otherwise({
        redirectTo: '/'
      });
  });