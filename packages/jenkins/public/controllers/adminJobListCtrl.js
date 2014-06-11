'use strict';

angular.module('mean').controller('JobListController', 
		['$scope','$rootScope','$http','$location','Jobs','JobListService', 
		 function($scope,$rootScope,$http,$location,Jobs,JobListService) {	
	
	$scope.initPage = function initPage() {
		$scope.find();
	};
	
	$scope.find = function find() {
	    Jobs.query(function(jobs) {
	    	$scope.jobs = jobs;
	    	JobListService.set(jobs);
	    });
	};

	// -------------- Event emitters --------------
	
	$scope.confirmRemoveJob = function confirmRemoveJob(job) {
		$rootScope.$emit('CONFIRM_DELETE_EVENT',job);
	};
	
	$scope.removeJob = function removeJob(job) {
		job.$delete(function() {
			$rootScope.$emit('JOB_DELETED_EVENT',job);
		});					
	};
		
	$scope.editJob = function editJob(job) {
		$rootScope.$emit('EDIT_JOB_EVENT',job);
	};
	
	// -------------- Handlers --------------
	
	$rootScope.$on('JOB_CREATED_EVENT', function(event, data) {
		$scope.jobs[$scope.jobs.length] = data;
	});

	$rootScope.$on('JOB_UPDATED_EVENT', function(event, data) {
	    var index = $scope.jobs.indexOf(data);
	    if (index != -1) {
	        $scope.jobs[index].name = data.name;
	        $scope.jobs[index].apiUrl = data.apiUrl;
	        $scope.jobs[index].alarm = data.alarm;		        
	    } 
	});
	
	$rootScope.$on('JOB_DELETED_EVENT', function(event, data) {
	    var index = $scope.jobs.indexOf(data);
	    if (index > -1) {
	        $scope.jobs.splice(index, 1);
	    }
	    $scope.showConfirmation = false;
	});
	
	$rootScope.$on('CONFIRM_DELETE_EVENT', function(event, data) {
		$scope.selectedJob = data;
		$scope.showConfirmation = true;       	
	});
}]);

