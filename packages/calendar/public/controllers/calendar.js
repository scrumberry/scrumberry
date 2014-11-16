'use strict';

angular.module('mean.calendar').controller('CalendarController', ['$rootScope','$scope', 'Global', 'CalendarListService','Calendars',
  function($rootScope,$scope, Global, CalendarListService, Calendars) {
    
	$scope.global = Global;
    
	$scope.initPage = function initPage() {
		$scope.findCalendars();
	};
	
	$scope.findCalendars = function findCalendars() {
	    Calendars.query(function(calendars) {
	    	$scope.calendars = calendars;
	    	CalendarListService.set(calendars);
	    });
	};

	// -------------- Event emitters --------------
	
	$scope.confirmRemoveCalendar = function confirmRemoveCalendar(calendar) {
		$rootScope.$emit('CONFIRM_DELETE_EVENT',calendar);
	};
	
	$scope.removeCalendar = function removeCalendar(calendar) {
		calendar.$delete(function() {
			$rootScope.$emit('CALENDAR_DELETED_EVENT',calendar);
		});					
	};
		
	$scope.editCalendar = function editCalendar(calendar) {
		$rootScope.$emit('EDIT_CALENDAR_EVENT',calendar);
	};
	
	// -------------- Handlers --------------
	
	$rootScope.$on('CALENDAR_CREATED_EVENT', function(event, data) {
		$scope.calendars[$scope.calendars.length] = data;
	});
	
	$rootScope.$on('CALENDAR_DELETED_EVENT', function(event, data) {
	    var index = $scope.calendars.indexOf(data);
	    if (index > -1) {
	        $scope.calendars.splice(index, 1);
	    }
	    $scope.showConfirmation = false;
	});
	
	$rootScope.$on('CONFIRM_DELETE_EVENT', function(event, data) {
		$scope.selectedCalendar = data;
		$scope.showConfirmation = true;       	
	});
	
}]);

angular.module('mean.calendar').controller('CalendarDetailsController', ['$rootScope','$scope', 'Global', 'Calendars',
  function($rootScope, $scope, Global, Calendars) {
	$scope.global = Global;	

	$scope.initForm = function initForm() {
		$scope.showSetupForm = false;
	};	

	$scope.addCalendar = function addCalendar() {
		$scope.updateForm = false;
		$scope.selectedCalendar = {title:'',description:'',externalId:'',externalAccount:'',location:'',timezone:''};
		$scope.showSetupForm = true;
	};
	
	$scope.saveCalendar = function saveCalendar(calendar) {
		if (calendar._id) {
			calendar.$update();			
		} else {
	        var newCalendar = new Calendars({
	            title: calendar.title,
	            description: calendar.description,
	            externalId: calendar.externalId,
	            externalAccount: calendar.externalAccount,
	            location: calendar.location,
	            timezone: calendar.timezone
	        });			
	        newCalendar.$save(function(response) {
	        	newCalendar._id = response._id;
	        	$rootScope.$emit('CALENDAR_CREATED_EVENT',newCalendar);
	        });
		}
		$scope.showSetupForm = false;
	};
	
	$scope.confirmRemoval = function confirmRemoval() {
		$scope.removeConfirmationLevel = 1;
	};
	
	$scope.removeCalendar = function removeCalendar(calendar) {
       calendar.$delete(function() {
    	   $rootScope.$emit('CALENDAR_DELETED_EVENT',calendar);
        });					
		$scope.showSetupForm = false;
	};
	
	$rootScope.$on('EDIT_CALENDAR_EVENT', function(event, data) {
		$scope.removeConfirmationLevel=0;
		$scope.updateForm = true;	
		$scope.selectedCalendar = data;
		$scope.showSetupForm = true;		
	});	
}
]);