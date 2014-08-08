'use strict';

(function() {
    // Jenkins Controller Spec
    describe('Jenkins Plugin controllers', function() {
        describe('JobListController', function() {
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
            var JobListController,
            	rootScope,
                scope,
                $httpBackend,
                $stateParams,
                $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

            	// mock of rootScope object
                scope = $rootScope.$new();
                rootScope = $rootScope;

                // inject mock into controller as $scope
                JobListController = $controller('JobListController', {
                	$rootScope: rootScope,
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one job object ' +
                    'fetched from XHR', function() {

               // SETUP
               $httpBackend.expectGET('jobs').respond([{
                   _id: '525a8422f6d0f87f0e407a33',
                   name: 'Scrumberry main build',
                   urlApi: 'http://localhost:80/api'
               }]);

               // TEST
               scope.find();
               $httpBackend.flush();

               // ASSERT
               expect(scope.jobs).toEqualData([{
                   _id: '525a8422f6d0f87f0e407a33',
                   name: 'Scrumberry main build',
                   urlApi: 'http://localhost:80/api'
               }]);

             });
            
            it('$scope.init() should call find() function', function() {
 
                // SETUP
                $httpBackend.expectGET('jobs').respond([{  }]);

                // TEST
                scope.initPage();
                $httpBackend.flush();

                // ASSERT
                expect(scope.job).not.toBe(null);

            });
            
            it('$scope.confirmRemoveJob should emit a CONFIRM_DELETE_EVENT event', function () {
                
            	// SETUP
            	var emitedJobData = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                    };
                };
                spyOn(rootScope, '$emit');
                
                // TEST
                scope.confirmRemoveJob(emitedJobData);
                
                // ASSERT
                expect(rootScope.$emit).toHaveBeenCalledWith('CONFIRM_DELETE_EVENT', emitedJobData);
                             
            });

           
            it('$scope.removeJob() should send a DELETE request with a jobId ' +
                   'and emit a JOB_DELETED_EVENT event', inject(function(Jobs) {

               	// SETUP
            	var deletedJob = new Jobs({
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                });               
                spyOn(rootScope, '$emit');             
                $httpBackend.expectDELETE(/jobs\/([0-9a-fA-F]{24})$/).respond(204);
                
                // TEST
                scope.removeJob(deletedJob);
                $httpBackend.flush();
                
                // ASSERT
                expect(rootScope.$emit).toHaveBeenCalledWith('JOB_DELETED_EVENT', deletedJob);
               
            }));
            
            it('$scope.editJob should emit a EDIT_JOB_EVENT event', function () {
                
            	// SETUP
            	var emitedJobData = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                    };
                };                
                spyOn(rootScope, '$emit');
                
                // TEST
                scope.editJob(emitedJobData);
                
                // ASSERT
                expect(rootScope.$emit).toHaveBeenCalledWith('EDIT_JOB_EVENT', emitedJobData);
                             
            });            

            it('$scope.jobs should contains the new emitted job', function () {
                
            	// SETUP
        	    scope.jobs = [];
            	var createdJob = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                    };
                };                
                
                // TEST
                rootScope.$emit('JOB_CREATED_EVENT', createdJob);
                
                // ASSERT
                expect(scope.jobs.length).toEqual(1);
                             
            }); 
            
           it('$scope.jobs should not contains the deleted job anymore if exists', function () {
                
            	// SETUP
             	var jobData = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Scrumberry main build',
                        urlApi: 'http://localhost:80/api'
                    };
                };
             	var ghostJob = function() {
                    return {
                    	_id: '525a8422f6d0f87f0e407a33',
                        name: 'Non existing job',
                        urlApi: 'http'
                    };
                };
           	    scope.jobs = [jobData];
           	    expect(scope.jobs.length).toEqual(1);
 
                // TEST
                rootScope.$emit('JOB_DELETED_EVENT', ghostJob);
                
                // ASSERT
                expect(scope.jobs.length).toEqual(1);
                
                // TEST
                rootScope.$emit('JOB_DELETED_EVENT', jobData);
                
                // ASSERT
                expect(scope.jobs.length).toEqual(0);
                             
            });
           
           it('$scope.selectedJob should be the emitted job if deletion confirmation', function () {
               
           		// SETUP
        	   scope.confirmation = false;
        	   var jobData = function() {
                   return {
                   	_id: '525a8422f6d0f87f0e407a33',
                       name: 'Scrumberry main build',
                       urlApi: 'http://localhost:80/api'
                   };
               };
               
               // TEST
               rootScope.$emit('CONFIRM_DELETE_EVENT', jobData);
               
               // ASSERT
               expect(scope.confirmation).toEqual(false);
               expect(scope.selectedJob).toEqualData(jobData);               
                            
           }); 
        });
    });
    
}());
