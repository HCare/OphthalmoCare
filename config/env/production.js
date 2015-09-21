'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/ophthalmocare',
    fileHandler:(process.env.CLOUDINARY_URL)?'cloudinary':'local',
    filesTemp:'files/temp/',
    filesUpload:'files/upload/',
    cloudinarySpace:process.env.CLOUDINARY_URL,
    cloudinaryCloud:'ophthalmocare',
    cloudinaryKey:'238558841776758',
    cloudinarySecret:'YklUomC6avzCLYAsnwQIYfp4Yco',
    patientPhotoFileName:'personal-photo',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-loading-bar/build/loading-bar.min.css',
				'public/lib/angularjs-toaster/toaster.css',
				'public/lib/ngImgCrop/compile/minified/ng-img-crop.css',
				'public/lib/angular-ui-select/dist/select.min.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
				'public/lib/ng-file-upload/ng-file-upload.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-cookies/angular-cookies.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-touch/angular-touch.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-translate/angular-translate.min.js',
				'public/lib/angular-ui-select/dist/select.min.js',
				'public/lib/tv4/tv4.js',
				'public/lib/objectpath/lib/ObjectPath.js',
				'public/lib/angular-schema-form/dist/schema-form.min.js',
				'public/lib/angular-schema-form/dist/bootstrap-decorator.min.js',
				'public/lib/angular-schema-form-ui-select/bootstrap-ui-select.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/angular-loading-bar/build/loading-bar.min.js',
				'public/lib/angularjs-toaster/toaster.js',
				'public/lib/moment/min/moment.min.js',
				'public/lib/angular-moment/angular-moment.min.js',
				'public/lib/webcam-directive/dist/1.1.0/webcam.min.js',
				'public/lib/angular-deckgrid/angular-deckgrid.min.js',
				'public/lib/ngImgCrop/compile/minified/ng-img-crop.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
