'use strict';

angular.module('mean.calendar').factory('Calendars', ['$resource', function($resource) {	
    return $resource('calendars/:calendarId', {
        calendarId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });	
}]);

angular.module('mean.calendar').factory('CalendarListService', function() {	
	var service = {};
	service.calendarlist = [];	
	service.set = function (items) {
		this.calendarlist = items;
	};
	service.reset = function () {
		this.calendarlist = [];
	};	
	return service;
});