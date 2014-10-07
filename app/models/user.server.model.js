'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	fullName: {
		type: String,
		trim: true,
		default: '',
		required: 'Please fill in user full name'
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		required: 'Please fill in user email',
        unique:'A user with that email already exists',
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	password: {
		type: String,
		default: '',
        required: 'Please fill in user password',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	_role: {
			type: String,
            required: 'Please select user role',
            ref: 'Role'
	},
    created: {
        time: {
            type: Date,
            default: Date.now
        },
        _user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
    updated: {
        time: {
            type: Date
        },
        _user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    },
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
  	resetPasswordExpires: {
  		type: Date
  	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

UserSchema.statics.hashPassword = function(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

UserSchema.statics.getSalt = function() {
    return new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
};


var User = mongoose.model('User', UserSchema);


/**Init User data*/
///System Administrator...

var Role=mongoose.model('Role');

///SysAdmin Role..
Role.findOneAndUpdate({name:'SysAdmin'}, {name: 'SysAdmin', _actions:['create_role', 'edit_role', 'delete_role', 'list_roles', 'view_role', 'create_user', 'edit_user', 'delete_user', 'list_users', 'view_user']}, {upsert:true}, function(err, role){
    if(err){
        console.log('Error Creating "SysAdmin" Role: '+JSON.stringify(err));
        return;
    }
    if(!role){
        console.log('Error Creating "SysAdmin" Role');
        return;
    }
    User.findOne({email: 'admin@ophthalmo.care'})
        .exec(function(err, user) {
            if (err){
                console.log('Error Creating System Administrator ' + JSON.stringify(err));
                return;
            }
            if (!user){
                var admin=new User({fullName: 'System Administrator', displayName: 'Admin', email:'admin@ophthalmo.care', password:'hardrock', _role:role._id});
                admin.save(function(err){
                    if(err){
                        console.log('Error Creating System Administrator ' + JSON.stringify(err));
                    }
                });
            }
        });
});


