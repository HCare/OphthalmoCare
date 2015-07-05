'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/ophthalmocare',
    graphDB: process.env.NEO4JGRAPHENE_URL || 'http://localhost:7474/',
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
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-loading-bar/build/loading-bar.css',
				'public/lib/angularjs-toaster/toaster.css',
				'public/lib/ngImgCrop/compile/minified/ng-img-crop.css',
				'public/lib/angular-ui-select/dist/select.css'
			],
			js: [
				'public/lib/ng-file-upload/angular-file-upload-shim.js',
				'public/lib/angular/angular.js',
				'public/lib/ng-file-upload/angular-file-upload.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-translate/angular-translate.js',
				'public/lib/angular-ui-select/dist/select.js',
				'public/lib/tv4/tv4.js',
				'public/lib/objectpath/lib/ObjectPath.js',
				'public/lib/angular-schema-form/dist/schema-form.js',
				'public/lib/angular-schema-form/dist/bootstrap-decorator.js',
				'public/lib/angular-schema-form-ui-select/bootstrap-ui-select.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-lodash/build/ng-lodash.js',
				'public/lib/angular-loading-bar/build/loading-bar.js',
				'public/lib/angularjs-toaster/toaster.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.js',
				'public/lib/webcam-directive/app/scripts/webcam.js',
				'public/lib/angular-deckgrid/angular-deckgrid.js',
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
