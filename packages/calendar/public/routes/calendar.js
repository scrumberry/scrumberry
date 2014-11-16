'use strict';

angular.module('mean.calendar').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('Calendar', {
      url: '/calendar/list',
      templateUrl: 'calendar/views/list.html'
    });
  }
]);
