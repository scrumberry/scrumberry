'use strict';

angular.module('mean').directive('jobdetail', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'jenkins/views/jobForm.html',
        link: function (scope, elem, attrs) {
          console.log("Recognized the jobDetail directive usage");
        }
      };
    });
