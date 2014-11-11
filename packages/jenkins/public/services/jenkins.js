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

angular.module('mean').factory('ParamsByCode', ['$http', function($http) {	
	var service = {};
	service.find = function(code, onSuccess) {
		$http({ method: 'GET', 
			url: '/paramByCode', 
			params: {code : code } })
		.success(onSuccess);
	};	
	return service;
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

angular.module('mean').factory('Params', ['$resource', function($resource) {	
    return $resource('jenkinsParams/:paramId', {
        paramId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });	
}]);