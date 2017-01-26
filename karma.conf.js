var webpack = require('webpack');
require('karma-spec-reporter');

module.exports = function(config) {
	config.set({
		frameworks: ['jasmine'],
		files: ['./entry.test.js'],
		preprocessors: {
			'entry.test.js': ['webpack', 'sourcemap']
		},
		webpack: {
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /(node_modules|public\/lib)/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015', 'stage-0'],
							plugins: ['transform-object-rest-spread']
						}
					},
					{
						test: /\.css$/,
						loader: 'style!css?sourceMap'
					}, {
						test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
						loader: 'url?limit=10000&name=fonts/[name]-[hash].[ext]'
					}, {
						test: /\.(jpe?g|png|gif)$/i,
						loader: 'file?hash=sha512&digest=hex&name=media/[name]-[hash].[ext]',
					}, {
						test: /\.html$/,
						loader: 'html'
					}
				]
			},
			plugins: [
				new webpack.ProvidePlugin({
					$: 'jquery',
					jQuery: 'jquery',
					'window.jQuery': 'jquery',
					_: 'lodash'
				})
			],
			devtool: 'inline-source-map'
		},
		webpackMiddleware: {
      stats: 'errors-only'
    },
		reporters: ['spec'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
	});
};

// 'use strict';

// /**
//  * Module dependencies.
//  */
// var applicationConfiguration = require('./config/config');

// // Karma configuration
// module.exports = function(config) {
// 	config.set({
// 		// Frameworks to use
// 		frameworks: ['jasmine'],

// 		// List of files / patterns to load in the browser
// 		files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

// 		// Test results reporter to use
// 		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
// 		//reporters: ['progress'],
// 		reporters: ['progress'],

// 		// Web server port
// 		port: 9876,

// 		// Enable / disable colors in the output (reporters and logs)
// 		colors: true,

// 		// Level of logging
// 		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
// 		logLevel: config.LOG_INFO,

// 		// Enable / disable watching file and executing tests whenever any file changes
// 		autoWatch: true,

// 		// Start these browsers, currently available:
// 		// - Chrome
// 		// - ChromeCanary
// 		// - Firefox
// 		// - Opera
// 		// - Safari (only Mac)
// 		// - PhantomJS
// 		// - IE (only Windows)
// 		browsers: ['PhantomJS'],

// 		// If browser does not capture in given timeout [ms], kill it
// 		captureTimeout: 60000,

// 		// Continuous Integration mode
// 		// If true, it capture browsers, run tests and exit
// 		singleRun: true
// 	});
// };
