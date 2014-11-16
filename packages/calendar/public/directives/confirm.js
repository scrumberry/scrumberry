'use strict';

angular.module('mean').directive('calendarConfirm', function () {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'calendar/views/confirm.html',
        link: function (scope, elem, attrs) {
        }
      };
    });