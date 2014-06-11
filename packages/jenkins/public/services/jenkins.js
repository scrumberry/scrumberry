'use strict';

angular.module('mean').factory('Jobs', ['$resource', function($resource) {	
    return $resource('jobs/:jobId', {
        jobId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });	
}]);

angular.module('mean').factory('RemoteJenkins', ['$http', function($http) {	
	var service = {};
	service.getJobList = function(remoteUrl, onSuccess) {
		$http({ method: 'GET', 
			url: '/remoteJobs', 
			params: {url : remoteUrl } })
		.success(onSuccess);
	};	
	return service;
}]);

angular.module('mean').factory('JobListService', function() {	
	var service = {};
	service.joblist = [];	
	service.set = function (items) {
		this.joblist = items;
	};
	service.reset = function () {
		this.joblist = [];
	};	
	return service;
});
