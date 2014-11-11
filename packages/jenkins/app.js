'use strict';

/*
 * Defining the Jenkins plugin package
 */
var Module = require('meanio').Module,
	mongoose = require('mongoose'),
	cron = require('cron'),
	monitoring = require('./server/controllers/monitoring'),
	io = require('../../server').io;

var initCrontab = function(frequency) {
	var crontab = '*/'+frequency+' * * * * *';
	var scheduledJob = function() {
		monitoring.checkJobs(io);
	};
	cron.job(crontab, scheduledJob).start();
	console.log('Jenkins module cron job initialized with frequency of '+frequency);
};

var initFrequency = function(cb) {
	return cb(monitoring.getFrequency());
};

var Jenkins = new Module('Jenkins');

Jenkins.register(function(app, auth, database) {

	// We enable routing. By default the Package Object is passed to the routes
	Jenkins.routes(app, auth, database);

	// We are adding a link to the main menu for all authenticated users
	Jenkins.menus.add({
		'roles' : [ 'authenticated' ],
		'title' : 'Jenkins',
		'link' : 'all jobs'
	});

	Jenkins.aggregateAsset('css', 'jenkins.css');
	
	var db = mongoose.connection;
	db.once('open', function callback () {
		var params = require('./server/controllers/params')
		params.getInitialFrequency( initCrontab );
	});

	return Jenkins;
});