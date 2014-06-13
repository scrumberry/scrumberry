'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), 
	Job = mongoose.model('Job'), 
	_ = require('lodash');

/**
 * List of Jobs
 */
exports.all = function(req, res) {
	Job.find().sort('-created').populate('user', 'name username').exec(
			function(err, jobs) {
				if (err) {
					res.render('error', {
						status : 500
					});
				} else {
					res.jsonp(jobs);
				}
			});
};

/**
 * Create a job
 */
exports.create = function(req, res) {
	var job = new Job(req.body);
	job.user = req.user;

	job.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				job : job
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Show a job
 */
exports.show = function(req, res) {
	res.jsonp(req.job);
};

/**
 * Delete a job
 */
exports.destroy = function(req, res) {
	var job = req.job;

	job.remove(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				job : job
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Update a job
 */
exports.update = function(req, res) {
	var job = req.job;

	job = _.extend(job, req.body);

	job.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				job : job
			});
		} else {
			res.jsonp(job);
		}
	});
};

/**
 * Find job by id
 */
exports.job = function(req, res, next, id) {
	Job.load(id, function(err, job) {
		if (err)
			return next(err);
		if (!job)
			return next(new Error('Failed to load job ' + id));
		req.job = job;
		next();
	});
};


exports.getRemoteList = function(req, res) {
	var url = req.query.url;
	// Jenkins remote API dependency
	var remote = require('./remote');	
	remote.getRemoteJobs(url, function(resp) {	
		if (resp!=='') {
			try {
				res.send(resp);
			} catch (err) {
				console.log('An error occured : '+err.message);
				res.jsonp('');
			}		
		}		
	});
};