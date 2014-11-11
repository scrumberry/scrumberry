'use strict';

angular.module('mean').controller('JobDetailsController', ['$scope','$rootScope','$http','$location','Jobs','RemoteJenkins','JobListService', 
                                                           function($scope,$rootScope,$http,$location,Jobs,RemoteJenkins,JobListService) {

	$scope.initForm = function initForm() {
		$scope.showSetupForm = false;
	};
	
	$scope.addJob = function addJob() {
		$scope.updateForm = false;
		$scope.jenkinsSearchMode = false;
		$scope.selectedJob = {name:'',apiUrl:'http://',alarm:'OFF',status:'Unknown'};
		$scope.showSetupForm = true;
		$scope.jenkinsJobList = {};
	};
	
	$scope.changeAlarm = function changeAlarm(job) {
		job.alarm = (job.alarm === 'ON' ? 'OFF' : 'ON');
	};
	
	$scope.saveJob = function saveJob(job) {
		if (job._id) {
	        job.$update();			
		} else {
	        var newJob = new Jobs({
	            name: job.name,
	            apiUrl: job.apiUrl,
	            alarm: job.alarm,
	            status: job.status,
	            lastUpdated: new Date(),
	            lastBuild: '',
	            lastFailedBuild: '',
	            lastStatusChange: new Date()
	        });			
	        newJob.$save(function(response) {
	        	newJob._id = response._id;
	        	$rootScope.$emit('JOB_CREATED_EVENT',newJob);
	        });
		}
		$scope.showSetupForm = false;
	};
	
	$scope.confirmRemoval = function confirmRemoval() {
		$scope.removeConfirmationLevel = 1;
	};
	
	$scope.removeJob = function removeJob(job) {
       job.$delete(function() {
    	   $rootScope.$emit('JOB_DELETED_EVENT',job);
        });					
		$scope.showSetupForm = false;
	};
	
	
	$scope.connectToJenkins = function connectToJenkins() {
		RemoteJenkins.getJobList($scope.jenkinsUrl, function (data) {
			$scope.jenkinsJobList = data.jobs;
			for (var i= 0; i < $scope.jenkinsJobList.length ; i++) {
				$scope.jenkinsJobList[i].selected = false;
				$scope.jenkinsJobList[i].url += 'api';
				$scope.jenkinsJobList[i].alreadySelected = 
					(JobListService.joblist) ? $scope.isJobAlreadySelected($scope.jenkinsJobList[i].url) : false;
			}
		});	
	};
	
	$scope.isJobAlreadySelected = function isJobAlreadySelected(url) {
		var selected = false, index= 0;
		while(index < JobListService.joblist.length && !selected) {
			if (JobListService.joblist[index].apiUrl === url) {
				selected = true;
			}
			index++;
		}	
		return selected;
	};
	
	$scope.addSelectedJobs = function addSelectedJobs() {
		for (var i= 0; i < $scope.jenkinsJobList.length ; i++) {
			var job = $scope.jenkinsJobList[i];
			if (job.selected === true) {
				 var newJob = new Jobs({
			         name: job.name,
			         apiUrl: job.url,
			         alarm: 'OFF',
			         status: 'Unknown'
			     });
				 saveJob(newJob);		
			}
		}
		$scope.showSetupForm = false;
	};
	
	$rootScope.$on('EDIT_JOB_EVENT', function(event, data) {
		$scope.removeConfirmationLevel=0;
		$scope.jenkinsSearchMode = false;
		$scope.jenkinsJobList = [];
		$scope.updateForm = true;	
		$scope.selectedJob = data;
		$scope.showSetupForm = true;		
	});
	
	function saveJob(newJob) {
	     newJob.$save(function(response) {
	        	newJob._id = response._id;
	        	$rootScope.$emit('JOB_CREATED_EVENT', newJob);
	     });
	}
	
}]);

