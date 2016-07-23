'use strict';

(function() {
	// Visits Controller Spec
	describe('Visits Controller Tests', function() {
		// Initialize global variables
		var VisitsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Visits controller.
			VisitsController = $controller('VisitsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Visit object fetched from XHR', inject(function(Visits) {
			// Create sample Visit using the Visits service
			var sampleVisit = new Visits({
				name: 'New Visit'
			});

			// Create a sample Visits array that includes the new Visit
			var sampleVisits = [sampleVisit];

			// Set GET response
			$httpBackend.expectGET('visits').respond(sampleVisits);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.visits).toEqualData(sampleVisits);
		}));

		it('$scope.findOne() should create an array with one Visit object fetched from XHR using a visitId URL parameter', inject(function(Visits) {
			// Define a sample Visit object
			var sampleVisit = new Visits({
				name: 'New Visit'
			});

			// Set the URL parameter
			$stateParams.visitId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/visits\/([0-9a-fA-F]{24})$/).respond(sampleVisit);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.visit).toEqualData(sampleVisit);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Visits) {
			// Create a sample Visit object
			var sampleVisitPostData = new Visits({
				name: 'New Visit'
			});

			// Create a sample Visit response
			var sampleVisitResponse = new Visits({
				_id: '525cf20451979dea2c000001',
				name: 'New Visit'
			});

			// Fixture mock form input values
			scope.name = 'New Visit';

			// Set POST response
			$httpBackend.expectPOST('visits', sampleVisitPostData).respond(sampleVisitResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Visit was created
			expect($location.path()).toBe('/visits/' + sampleVisitResponse._id);
		}));

		it('$scope.update() should update a valid Visit', inject(function(Visits) {
			// Define a sample Visit put data
			var sampleVisitPutData = new Visits({
				_id: '525cf20451979dea2c000001',
				name: 'New Visit'
			});

			// Mock Visit in scope
			scope.visit = sampleVisitPutData;

			// Set PUT response
			$httpBackend.expectPUT(/visits\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/visits/' + sampleVisitPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid visitId and remove the Visit from the scope', inject(function(Visits) {
			// Create new Visit object
			var sampleVisit = new Visits({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Visits array and include the Visit
			scope.visits = [sampleVisit];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/visits\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVisit);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.visits.length).toBe(0);
		}));
	});
}());