'use strict';

module.exports = {
	app: {
		title: 'OphthalmoCare',
		description: 'Ophthalmology Clinic Management System',
		keywords: 'Ophthalmology, Doctor, Patient, Clinic'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-loading-bar/build/loading-bar.css',
                'public/lib/angularjs-toaster/toaster.css',
                'public/lib/ngImgCrop/compile/unminified/ng-img-crop.css',
                'public/lib/angular-ui-select/dist/select.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/ng-file-upload/ng-file-upload-shim.js',
                'public/lib/ng-file-upload/ng-file-upload.js',
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
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
