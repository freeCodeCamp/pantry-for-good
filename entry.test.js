require('angular');
require('angular-mocks');
require('./public/application.js');

// require all modules ending in ".test.js" from the
// modules subdirectories
var testsContext = require.context("./public/modules", true, /\.test\.js$/);
testsContext.keys().forEach(testsContext);
