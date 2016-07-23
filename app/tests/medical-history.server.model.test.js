'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	MedicalHistory = mongoose.model('MedicalHistory');

/**
 * Globals
 */
var user, medicalHistory;

/**
 * Unit tests
 */
describe('Medical history Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			medicalHistory = new MedicalHistory({
				name: 'Medical history Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return medicalHistory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			medicalHistory.name = '';

			return medicalHistory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		MedicalHistory.remove().exec();
		User.remove().exec();

		done();
	});
});