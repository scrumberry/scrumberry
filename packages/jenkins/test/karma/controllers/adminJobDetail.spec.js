'use strict';

(function() {
    // Jenkins Controller Spec
    describe('Jenkins Plugin controllers', function() {
        describe('JobDetailsController', function() {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function() {
                this.addMatchers({
                    toEqualData: function(expected) {
                        return angular.equals(this.actual, expected);
                    }
                });
            });

            // Load the controllers module
            beforeEach(module('mean'));

            // Initialize the controller and a mock scope
            var JobDetailsController,
            	rootScope,
                scope,
                $httpBackend,
                $stateParams,
                $location;
                //JobListService;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

            	// mock of rootScope object
                scope = $rootScope.$new();
                rootScope = $rootScope;
                // inject mock into controller as $scope
                JobDetailsController = $controller('JobDetailsController', {
                	$rootScope: rootScope,
                    $scope: scope
                });
                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;

            }));

            it('$scope should initialize without form displayed', function() {
               // TEST
               scope.initForm();             
               // ASSERT
               expect(scope.showSetupForm).toEqual(false);
             });
            
            it('$scope.addJob() should initialize selectedJob', function() {
                // TEST
                scope.addJob();                
                // ASSERT
                expect(scope.selectedJob).not.toBe(null);
             });
            
            it('$scope.changeAlarm() should switch the alarm value', function() {
            	// SETUP
            	var jobData = {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api',
                        alarm: 'ON'
                };                
                // TEST
                scope.changeAlarm(jobData);                
                // ASSERT
                expect(jobData.alarm).toEqual('OFF');
                // TEST
                scope.changeAlarm(jobData);                
                // ASSERT
                expect(jobData.alarm).toEqual('ON');                
            });
            
            it('$scope.saveJob() should update job if it was an identitfied job', inject(function(Jobs) {
            	// SETUP
                var putJobData = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api',
                        alarm: 'ON'
                    };
                };
                scope.showSetupForm = true;                
                // mock job object from form
                var job = new Jobs(putJobData());                
                // test PUT happens correctly
                $httpBackend.expectPUT(/jobs\/([0-9a-fA-F]{24})$/).respond();
                // mock article in scope
                scope.saveJob(job);
                $httpBackend.flush();
                expect(scope.showSetupForm).toEqual(false);
            }));          
            
            it('$scope.saveJob() should post job if it was a new job and emit a JOB_CREATED_EVENT event', inject(function(Jobs) {
            	// SETUP
                var postJobData = function() {
                    return {
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api',
                        alarm: 'ON'
                    };
                };
                var emitted = {
                        _id: '525cf20451979dea2c000001',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api',
                        alarm: 'ON'
                    };
                scope.showSetupForm = true;
                var job = new Jobs(postJobData());               
                spyOn(rootScope, '$emit');
                $httpBackend.expectPOST('jobs').respond(emitted);               
                // TEST
                scope.saveJob(job);
                $httpBackend.flush();
                // ASSERT
                expect(scope.showSetupForm).toEqual(false);
            }));
  
            /*
            it('$scope.connectToJenkins() should create an array with at least one job object ', inject(function(RemoteJenkins) {
            	
            	// SETUP
            	//scope.jenkinsJobList = [];
            	var remoteData = function() {
            		return [{
                        _id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                    }];
            	};
            	
            	RemoteJenkins = {
            			getJobList: function() { return $q.remoteData(); }
            	};
            	spyOn(RemoteJenkins, 'getJobList').andReturn(remoteData());
            	
            	// TEST
                scope.connectToJenkins();
                
            	// ASSERT
                expect(scope.jenkinsJobList.length).toEqual(1);
                expect(scope.jenkinsJobList).toEqualData([{
                    _id: '525a8422f6d0f87f0e407a33',
                    name: 'Scrumberry main build',
                    urlApi: 'http://localhost:80/api'
                }]);         	
            }));
            */

            /*
            it('$scope.isJobAlreadySelected() should return true if an array with at least one job object', inject(function(JobListService) {

            	// SETUP
             	JobListService = {
            			jobList: function() { return [{
                            _id: '525a8422f6d0f87f0e407a33',
                            name: 'Scrumberry main build',
                            urlApi: 'http://localhost:80/api'
                        }]; }
            	};           	
            	spyOn(JobListService, 'jobList').andReturn([{
                    _id: '525a8422f6d0f87f0e407a33',
                    name: 'Scrumberry main build',
                    urlApi: 'http://localhost:80/api'
                }]);
                
           	
            	// TEST
            	var res = scope.isJobAlreadySelected('http://localhost:80/api');
            	// ASSERT
            	expect(res).toEqual(true);
            	
            }));
            */
        });
    });
    
}());
