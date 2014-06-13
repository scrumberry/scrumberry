'use strict';

angular.module('mean').directive('jenkinsDashboard', function () {
	
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'jenkins/views/jenkinsDashboard.html',
        link: function (scope, elem, attrs) {
    		
    		scope.alarmingJobs = [];
    		scope.alarmsCount = 0;
    		scope.jenkinsInError = false;
    		var socket = io.connect();
    		
    		scope.addJobInAlarm = function (job) {
    			var index = scope.alarmingJobs.indexOf(job.name);
    		    if (index < 0) {
    		    	scope.alarmsCount++;
        			scope.alarmingJobs.push(job.name);   	
    		    }	
    			scope.jenkinsInError = (scope.alarmsCount>0);			
    		};
    		
    		scope.removeJobInAlarm = function (job) {   			
    		    var index = scope.alarmingJobs.indexOf(job.name);
    		    if (index > -1) {
    		    	scope.alarmsCount--;
    		        scope.alarmingJobs.splice(index, 1);
    		    }
    			scope.jenkinsInError = (scope.alarmsCount>0);			
    		};
    		
    		socket.on('connect', function() {
    			scope.connected = true;
    		});
    		
    		socket.on('JENKINS_JOB_STATUS_CHANGE', function(event) {
    			if (event.data.lastBuild.number === event.data.lastFailedBuild.number) {
    				scope.addJobInAlarm(event.data);
    			} else {
    				scope.removeJobInAlarm(event.data);
    			}

    			scope.$apply();
    		});       	
        }
      };
    });