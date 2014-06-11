'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');
var db = mongoose.connect(config.db);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

// Start the app by listening on <port>, optional hostname
// [var server =] added for cron start below
var server = app.listen(config.port, config.hostname);

console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;

/* =================================================================== *
 * Initializing cron jobs for JENKINS plugin                           *
 * =================================================================== */
var io = require('socket.io')(8888);
io = io.listen(server);
console.log('Socket.io initialized');
var cron = require('cron');
var monitoring = require('./packages/jenkins/server/controllers/monitoring');
var cronJob = cron.job('*/5 * * * * *', function(){
		monitoring.checkJobs(io);
}); 
cronJob.start();
console.log('Cron job started');
/* =================================================================== */