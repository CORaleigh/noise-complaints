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
    'duScroll',
    'ngMaterial',
    'ngMaterialDatePicker'
  ])
  .config(function ($routeProvider, $httpProvider, $mdThemingProvider) {
  // $mdThemingProvider.theme('default')
  //   .dark();    
$httpProvider.defaults.headers.post['Content-Type'] = 'application/json';    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
