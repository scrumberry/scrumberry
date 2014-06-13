'use strict';

(function() {
	// Jenkins Jobs Controller Spec
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
            
            // Load the module
            beforeEach(module('mean'));
            
            // Initialize the controller and a mock scope
            var JobListController,
                scope,
                $httpBackend,
                $stateParams,
                $location;
            
            beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
                scope = $rootScope.$new();
                JobListController = $controller('JobListController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;
                $httpBackend = _$httpBackend_;
                $location = _$location_;
            }));
            
            it('$scope.find() should create an array with at least one job object ' +
                    'fetched from XHR', function() {

                        // test expected GET request
                        $httpBackend.expectGET('jobs').respond([{
                        	_id: '525a8422f6d0f87f0e407a33',
                            name: 'Scrumberry main build',
                            urlApi: 'http://localhost:80/api'
                        }]);

                        // run controller
                        scope.find();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.jobs).toEqualData([{
                        	_id: '525a8422f6d0f87f0e407a33',
                            name: 'Scrumberry main build',
                            urlApi: 'http://localhost:80/api'
                        }]);

                    });

		});	
	});
});