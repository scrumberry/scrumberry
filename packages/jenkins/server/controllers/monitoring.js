'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), 
	jobmodel = require('../models/job'),
	remote = require('./jenkinsApi');

/** =======================================
 *  Function declarations 
 ** ======================================= */
var saveJobStatus = function(job, status) {
	if (job.status !== 'Failed' && status === 'Failed') {
		job.lastFailedBuild = job.lastBuild.number;
	}
	job.lastUpdated = job.lastStatusChange = new Date();	
	job.status = status;
	job.save(function(err) {
		if (err) {
			console.error('An error occured while updating '+job.name+' in database');
		}
	});
};

var sendSocketEvent = function(jobData, io) {	
	io.sockets.emit('JENKINS_JOB_STATUS_CHANGE', { data: jobData } );
	console.log('JENKINS_JOB_STATUS_CHANGE['+jobData.name+'] event sent');
};

var defineJobStatus = function (job) {
	var status = 'Aborted'
	if (job.lastCompletedBuild.number === job.lastFailedBuild.number) {
		 status = 'Failed';
	} else if (job.lastCompletedBuild.number === job.lastSuccessfulBuild.number) {
		status = 'Success'
	};
	return status;
};

var getRemoteJob = function (job, checked) {
	var jsonResp = '';	
	remote.checkJob(job, function(resp) {	
		if (resp!=='') {
			try {
				jsonResp = JSON.parse(resp);
				checked(jsonResp);
			} catch (err) {
				console.log('An error occured : '+err.message+'|'+err.stack);
				checked('');
			}		
		}		
	});
};

/** =======================================
 * This method follow the steps below to monitor the Jobs :
 * 1 - Calls the DAO to list All persisted Jobs 
 * 2 - Calls the Jenkins API for each job
 * 3 - Sends a message using web socket for each job to the client
 ** ======================================= */
module.exports.checkJobs = function(io) {  
	var Job = mongoose.model('Job');
	// For each job, we call remote Jenkins API
	Job.find().sort('-created').populate('user', 'name username').exec(
		function(err, jobs) {
			if (err) {
				// TODO Handle error
				console.error('Cannot retrieve persisted jobs');
			} else {
				(function(){
					var rank = 0;
					function asyncWhile() {
						if (rank < jobs.length) {
							var job = jobs[rank];
							// We call remote Jenkins API to retrieve job state
							getRemoteJob(job, function(jobData) {
								var status = 'Unknown';
								if (jobData !== '') {							
									job.lastBuild = jobData.lastBuild.number;
									job.lastFailedBuild = jobData.lastFailedBuild.number;
									status = defineJobStatus(jobData)
								} else {
									console.error('Remote job '+job.name+' not found at '+job.apiUrl);
									jobData = job;
								}
								jobData.status = status;
								var notSuccessfull = (jobData.status !== 'Success');							
								var hasChanged = (job.status !== status);
								// If status has changed, its new value and date are persisted
								if (hasChanged) {
									saveJobStatus(job, status);
								} 
								jobData.lastStatusChange = job.lastStatusChange;								
								// And a message is emitted to the client browser
								if (hasChanged || notSuccessfull) {
									sendSocketEvent(jobData, io);
								}
														
								// Incrementing rank and calling asyncWhile recursively -> next async step for loop
								rank++;
								asyncWhile();
							});							
						}
				}
				asyncWhile();
				})();
			}
		});
};