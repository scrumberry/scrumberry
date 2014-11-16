'use strict';

angular.module('mean.calendar').directive('calendarDetail', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'calendar/views/calendarDetail.html',
        link: function (scope, elem, attrs) {
          
        }
      };
    });
