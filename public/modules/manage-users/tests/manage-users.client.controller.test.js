'use strict';

(function() {
	// Manage users Controller Spec
	describe('Manage users Controller Tests', function() {
		// Initialize global variables
		var ManageUsersController,
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

			// Initialize the Manage users controller.
			ManageUsersController = $controller('ManageUsersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Manage user object fetched from XHR', inject(function(ManageUsers) {
			// Create sample Manage user using the Manage users service
			var sampleManageUser = new ManageUsers({
				name: 'New Manage user'
			});

			// Create a sample Manage users array that includes the new Manage user
			var sampleManageUsers = [sampleManageUser];

			// Set GET response
			$httpBackend.expectGET('manage-users').respond(sampleManageUsers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageUsers).toEqualData(sampleManageUsers);
		}));

		it('$scope.findOne() should create an array with one Manage user object fetched from XHR using a manageUserId URL parameter', inject(function(ManageUsers) {
			// Define a sample Manage user object
			var sampleManageUser = new ManageUsers({
				name: 'New Manage user'
			});

			// Set the URL parameter
			$stateParams.manageUserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/manage-users\/([0-9a-fA-F]{24})$/).respond(sampleManageUser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.manageUser).toEqualData(sampleManageUser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ManageUsers) {
			// Create a sample Manage user object
			var sampleManageUserPostData = new ManageUsers({
				name: 'New Manage user'
			});

			// Create a sample Manage user response
			var sampleManageUserResponse = new ManageUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage user'
			});

			// Fixture mock form input values
			scope.name = 'New Manage user';

			// Set POST response
			$httpBackend.expectPOST('manage-users', sampleManageUserPostData).respond(sampleManageUserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Manage user was created
			expect($location.path()).toBe('/manage-users/' + sampleManageUserResponse._id);
		}));

		it('$scope.update() should update a valid Manage user', inject(function(ManageUsers) {
			// Define a sample Manage user put data
			var sampleManageUserPutData = new ManageUsers({
				_id: '525cf20451979dea2c000001',
				name: 'New Manage user'
			});

			// Mock Manage user in scope
			scope.manageUser = sampleManageUserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/manage-users\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/manage-users/' + sampleManageUserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid manageUserId and remove the Manage user from the scope', inject(function(ManageUsers) {
			// Create new Manage user object
			var sampleManageUser = new ManageUsers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Manage users array and include the Manage user
			scope.manageUsers = [sampleManageUser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/manage-users\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleManageUser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.manageUsers.length).toBe(0);
		}));
	});
}());