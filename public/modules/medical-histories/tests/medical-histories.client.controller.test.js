'use strict';

(function() {
	// Medical histories Controller Spec
	describe('Medical histories Controller Tests', function() {
		// Initialize global variables
		var MedicalHistoriesController,
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

			// Initialize the Medical histories controller.
			MedicalHistoriesController = $controller('MedicalHistoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Medical history object fetched from XHR', inject(function(MedicalHistories) {
			// Create sample Medical history using the Medical histories service
			var sampleMedicalHistory = new MedicalHistories({
				name: 'New Medical history'
			});

			// Create a sample Medical histories array that includes the new Medical history
			var sampleMedicalHistories = [sampleMedicalHistory];

			// Set GET response
			$httpBackend.expectGET('medical-histories').respond(sampleMedicalHistories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.medicalHistories).toEqualData(sampleMedicalHistories);
		}));

		it('$scope.findOne() should create an array with one Medical history object fetched from XHR using a medicalHistoryId URL parameter', inject(function(MedicalHistories) {
			// Define a sample Medical history object
			var sampleMedicalHistory = new MedicalHistories({
				name: 'New Medical history'
			});

			// Set the URL parameter
			$stateParams.medicalHistoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/medical-histories\/([0-9a-fA-F]{24})$/).respond(sampleMedicalHistory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.medicalHistory).toEqualData(sampleMedicalHistory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(MedicalHistories) {
			// Create a sample Medical history object
			var sampleMedicalHistoryPostData = new MedicalHistories({
				name: 'New Medical history'
			});

			// Create a sample Medical history response
			var sampleMedicalHistoryResponse = new MedicalHistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Medical history'
			});

			// Fixture mock form input values
			scope.name = 'New Medical history';

			// Set POST response
			$httpBackend.expectPOST('medical-histories', sampleMedicalHistoryPostData).respond(sampleMedicalHistoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Medical history was created
			expect($location.path()).toBe('/medical-histories/' + sampleMedicalHistoryResponse._id);
		}));

		it('$scope.update() should update a valid Medical history', inject(function(MedicalHistories) {
			// Define a sample Medical history put data
			var sampleMedicalHistoryPutData = new MedicalHistories({
				_id: '525cf20451979dea2c000001',
				name: 'New Medical history'
			});

			// Mock Medical history in scope
			scope.medicalHistory = sampleMedicalHistoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/medical-histories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/medical-histories/' + sampleMedicalHistoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid medicalHistoryId and remove the Medical history from the scope', inject(function(MedicalHistories) {
			// Create new Medical history object
			var sampleMedicalHistory = new MedicalHistories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Medical histories array and include the Medical history
			scope.medicalHistories = [sampleMedicalHistory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/medical-histories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMedicalHistory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.medicalHistories.length).toBe(0);
		}));
	});
}());