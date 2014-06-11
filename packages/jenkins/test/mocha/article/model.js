'use strict';

require('../../../server/models/job');

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Job = mongoose.model('Job');

// Globals
var user;
var job;

// Tests
describe('<Unit Test>', function() {
	describe('Model Job:', function() {		

		// Setup before each test
		beforeEach(function(done) {
			
			// User db insertion 
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });
            // Job instance insertion
            user.save(function() {
                job = new Job({
                    name: 'Jenkins Main Job',
                    lastFailedBuild: '9990',
                    lastFailed: '9978',
                    lastStatusChange: '2014-05-23T11:48:05.898Z',
                    alarm: 'ON' ,
                    status: 'SUCCESS' ,
                    apiUrl: 'http://localhost:8080/jenkins/api' ,
                    user: user
                });
                done();
            });			
		});

        describe('Method Save', function() {       	
            it('should be able to save without problems', function(done) {
                return job.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
            it('should be able to show an error when try to save without name', function(done) {
                job.name = '';
                return job.save(function(err) {
                	should.exist(err);
                    done();
                });
            });           
            it('should be able to save without problems even with a blank last build', function(done) {
                job.lastBuild = '';
                return job.save(function(err) {
                	should.not.exist(err);
                    done();
                });
            });         
            it('should be able to save without problems even with a blank last failed build', function(done) {
                job.lastFailedBuild = '';
                return job.save(function(err) {
                	should.not.exist(err);
                    done();
                });
            });            
            it('should be able to save without problems even with a blank last status change', function(done) {
                job.lastStatusChange = '';
                return job.save(function(err) {
                	should.not.exist(err);
                    done();
                });
            }); 
            it('should be able to save without problems even with a blank alarm', function(done) {
                job.alarm = '';
                return job.save(function(err) {
                	should.not.exist(err);
                    done();
                });
            });
            it('should be able to save without problems even with a blank status', function(done) {
                job.status = '';
                return job.save(function(err) {
                	should.not.exist(err);
                    done();
                });
            });           
        });

        afterEach(function(done) {
            job.remove();
            user.remove();
            done();
        });
		
	});
});

