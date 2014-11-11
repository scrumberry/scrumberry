'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), 
	_ = require('lodash'),
	params = mongoose.model("JenkinsParam");

/**
 * List of Jenkins parameters
 */
module.exports.all = function(req, res) {
	params.find().sort('-created').populate('user', 'name username').exec(
			function(err, params) {
				if (err) {
					res.render('error', {
						status : 500
					});
				} else {
					res.jsonp(params);
				}
			});
};

/**
 * Create a Jenkins parameter
 */
module.exports.create = function(req, res) {
	var param = new JenkinsParam(req.body);
	param.user = req.user;
	param.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				param : param
			});
		} else {
			res.jsonp(param);
		}
	});
};

/**
 * Show a Jenkins parameter
 */
module.exports.show = function(req, res) {
	res.jsonp(req.param);
};

/**
 * Delete a Jenkins parameter
 */
module.exports.destroy = function(req, res) {
	var param = req.param;
	param.remove(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				param : param
			});
		} else {
			res.jsonp(param);
		}
	});
};

/**
 * Update a Jenkins parameter
 */
module.exports.update = function(req, res) {
	var param = req.param;
	param = _.extend(param, req.body);
	param.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors : err.errors,
				param : param
			});
		} else {
			res.jsonp(param);
		}
	});
};

/**
 * Find a Jenkins parameter by id
 */
module.exports.param = function(req, res, next, id) {
	params.load(id, function(err, param) {
		if (err)
			return next(err);
		if (!param)
			return next(new Error('Failed to load a parameter ' + id));
		req.param = param;
		next();
	});
};

module.exports.getInitialFrequency = function( callback ) {
	params.findOne({code: 'FREQUENCY'}).select('value').exec(function(err, param) {
		if (err) {
			console.error('Can not retrieve frequency : '+err);
		}
		if (!param) {
			console.error('Failed to load initial frequency parameter');
		}
		callback(param.value);
	});
}