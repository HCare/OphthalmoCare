'use strict';

(function() {
	// Complaints Controller Spec
	describe('Complaints Controller Tests', function() {
		// Initialize global variables
		var ComplaintsController,
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

			// Initialize the Complaints controller.
			ComplaintsController = $controller('ComplaintsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Complaint object fetched from XHR', inject(function(Complaints) {
			// Create sample Complaint using the Complaints service
			var sampleComplaint = new Complaints({
				name: 'New Complaint'
			});

			// Create a sample Complaints array that includes the new Complaint
			var sampleComplaints = [sampleComplaint];

			// Set GET response
			$httpBackend.expectGET('complaints').respond(sampleComplaints);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.complaints).toEqualData(sampleComplaints);
		}));

		it('$scope.findOne() should create an array with one Complaint object fetched from XHR using a complaintId URL parameter', inject(function(Complaints) {
			// Define a sample Complaint object
			var sampleComplaint = new Complaints({
				name: 'New Complaint'
			});

			// Set the URL parameter
			$stateParams.complaintId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/complaints\/([0-9a-fA-F]{24})$/).respond(sampleComplaint);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.complaint).toEqualData(sampleComplaint);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Complaints) {
			// Create a sample Complaint object
			var sampleComplaintPostData = new Complaints({
				name: 'New Complaint'
			});

			// Create a sample Complaint response
			var sampleComplaintResponse = new Complaints({
				_id: '525cf20451979dea2c000001',
				name: 'New Complaint'
			});

			// Fixture mock form input values
			scope.name = 'New Complaint';

			// Set POST response
			$httpBackend.expectPOST('complaints', sampleComplaintPostData).respond(sampleComplaintResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Complaint was created
			expect($location.path()).toBe('/complaints/' + sampleComplaintResponse._id);
		}));

		it('$scope.update() should update a valid Complaint', inject(function(Complaints) {
			// Define a sample Complaint put data
			var sampleComplaintPutData = new Complaints({
				_id: '525cf20451979dea2c000001',
				name: 'New Complaint'
			});

			// Mock Complaint in scope
			scope.complaint = sampleComplaintPutData;

			// Set PUT response
			$httpBackend.expectPUT(/complaints\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/complaints/' + sampleComplaintPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid complaintId and remove the Complaint from the scope', inject(function(Complaints) {
			// Create new Complaint object
			var sampleComplaint = new Complaints({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Complaints array and include the Complaint
			scope.complaints = [sampleComplaint];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/complaints\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleComplaint);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.complaints.length).toBe(0);
		}));
	});
}());