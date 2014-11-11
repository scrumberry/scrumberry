'use strict';

angular.module('mean').controller('JobListController', 
		['$scope','$rootScope','$http','$location','Jobs','JobListService','Params', 
		 function($scope,$rootScope,$http,$location,Jobs,JobListService,Params) {	
	
	$scope.initPage = function initPage() {
		$scope.findJobs();
	};
	
	$scope.findJobs = function findJobs() {
	    Jobs.query(function(jobs) {
	    	$scope.jobs = jobs;
	    	JobListService.set(jobs);
	    });
	};

	$scope.findParams = function findParams() {
		Params.query(function(params) {
	    	if (params.length>0) {
				$scope.params = params;	    		
	    	} else {
	    		$scope.params = [{code:'FREQUENCY',name:'Frequency in seconds', value:'15'}];
	    	}
	    });
	};
	
	$scope.changeSettings = function changeSettings() {
		$scope.findParams();		
		$scope.showSettingsForm = true;
	};
	
	$scope.saveParam = function saveParam(param) {
		if (param._id) {
			param.$update();
		} else {
			var newParam = new Params({
				code: param.code,
				name: param.name,
				value: param.value
			});
	        newParam.$save(function(response) {
	        	newParam._id = response._id;
	        });		
		}
	};

	$scope.saveSettings = function saveSettings() {
		for (var i= 0; i < $scope.params.length ; i++) {
			var current = $scope.params[i];
			$scope.saveParam(current);
		}
		$scope.showSettingsForm = false;
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

