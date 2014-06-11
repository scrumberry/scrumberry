'use strict';

angular.module('mean').directive('confirm', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'jenkins/views/confirm.html',
        link: function (scope, elem, attrs) {
        }
      };
    });