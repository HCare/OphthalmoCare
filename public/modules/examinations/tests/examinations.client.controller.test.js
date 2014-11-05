'use strict';

(function() {
	// Examinations Controller Spec
	describe('Examinations Controller Tests', function() {
		// Initialize global variables
		var ExaminationsController,
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

			// Initialize the Examinations controller.
			ExaminationsController = $controller('ExaminationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Examination object fetched from XHR', inject(function(Examinations) {
			// Create sample Examination using the Examinations service
			var sampleExamination = new Examinations({
				name: 'New Examination'
			});

			// Create a sample Examinations array that includes the new Examination
			var sampleExaminations = [sampleExamination];

			// Set GET response
			$httpBackend.expectGET('examinations').respond(sampleExaminations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.examinations).toEqualData(sampleExaminations);
		}));

		it('$scope.findOne() should create an array with one Examination object fetched from XHR using a examinationId URL parameter', inject(function(Examinations) {
			// Define a sample Examination object
			var sampleExamination = new Examinations({
				name: 'New Examination'
			});

			// Set the URL parameter
			$stateParams.examinationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/examinations\/([0-9a-fA-F]{24})$/).respond(sampleExamination);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.examination).toEqualData(sampleExamination);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Examinations) {
			// Create a sample Examination object
			var sampleExaminationPostData = new Examinations({
				name: 'New Examination'
			});

			// Create a sample Examination response
			var sampleExaminationResponse = new Examinations({
				_id: '525cf20451979dea2c000001',
				name: 'New Examination'
			});

			// Fixture mock form input values
			scope.name = 'New Examination';

			// Set POST response
			$httpBackend.expectPOST('examinations', sampleExaminationPostData).respond(sampleExaminationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Examination was created
			expect($location.path()).toBe('/examinations/' + sampleExaminationResponse._id);
		}));

		it('$scope.update() should update a valid Examination', inject(function(Examinations) {
			// Define a sample Examination put data
			var sampleExaminationPutData = new Examinations({
				_id: '525cf20451979dea2c000001',
				name: 'New Examination'
			});

			// Mock Examination in scope
			scope.examination = sampleExaminationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/examinations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/examinations/' + sampleExaminationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid examinationId and remove the Examination from the scope', inject(function(Examinations) {
			// Create new Examination object
			var sampleExamination = new Examinations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Examinations array and include the Examination
			scope.examinations = [sampleExamination];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/examinations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleExamination);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.examinations.length).toBe(0);
		}));
	});
}());