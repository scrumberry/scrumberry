'use strict';

angular.module('mean').directive('settings', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'jenkins/views/settings.html',
        link: function (scope, elem, attrs) {
          
        }
      };
    });
