'use strict';

module.exports.checkJob = function(job, callback) {
	callRemoteJenkins(job.apiUrl, function(response) {
		callback(response);
	});
};

module.exports.getRemoteJobs = function(url, callback) {
	callRemoteJenkins(url, function(response) {
		callback(response);
	});
};

var callRemoteJenkins = function(url, callback) {
	var http = require('http');
	var request = http.request(url, function(response) {
		var str = '';
		response.on('data', function(chunk) {
			str += chunk;
		});
		response.on('end', function() {
			callback(str);
		});
	});
	request.on('error', function(e) {
		console.error('Error connecting ' + url + ' : ' + e.message);
	});
	request.end();
};