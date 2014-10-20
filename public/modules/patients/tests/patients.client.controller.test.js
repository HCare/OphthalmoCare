'use strict';

(function() {
	// Patients Controller Spec
	describe('Patients Controller Tests', function() {
		// Initialize global variables
		var PatientsController,
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

			// Initialize the Patients controller.
			PatientsController = $controller('PatientsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Patient object fetched from XHR', inject(function(Patients) {
			// Create sample Patient using the Patients service
			var samplePatient = new Patients({
				name: 'New Patient'
			});

			// Create a sample Patients array that includes the new Patient
			var samplePatients = [samplePatient];

			// Set GET response
			$httpBackend.expectGET('patients').respond(samplePatients);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patients).toEqualData(samplePatients);
		}));

		it('$scope.findOne() should create an array with one Patient object fetched from XHR using a patientId URL parameter', inject(function(Patients) {
			// Define a sample Patient object
			var samplePatient = new Patients({
				name: 'New Patient'
			});

			// Set the URL parameter
			$stateParams.patientId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/patients\/([0-9a-fA-F]{24})$/).respond(samplePatient);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patient).toEqualData(samplePatient);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Patients) {
			// Create a sample Patient object
			var samplePatientPostData = new Patients({
				name: 'New Patient'
			});

			// Create a sample Patient response
			var samplePatientResponse = new Patients({
				_id: '525cf20451979dea2c000001',
				name: 'New Patient'
			});

			// Fixture mock form input values
			scope.name = 'New Patient';

			// Set POST response
			$httpBackend.expectPOST('patients', samplePatientPostData).respond(samplePatientResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Patient was created
			expect($location.path()).toBe('/patients/' + samplePatientResponse._id);
		}));

		it('$scope.update() should update a valid Patient', inject(function(Patients) {
			// Define a sample Patient put data
			var samplePatientPutData = new Patients({
				_id: '525cf20451979dea2c000001',
				name: 'New Patient'
			});

			// Mock Patient in scope
			scope.patient = samplePatientPutData;

			// Set PUT response
			$httpBackend.expectPUT(/patients\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/patients/' + samplePatientPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patientId and remove the Patient from the scope', inject(function(Patients) {
			// Create new Patient object
			var samplePatient = new Patients({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Patients array and include the Patient
			scope.patients = [samplePatient];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/patients\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePatient);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patients.length).toBe(0);
		}));
	});
}());