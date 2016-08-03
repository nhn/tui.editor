'use strict';

//var context = require.context('.', true, /.+\.spec\.js?$/);
//context.keys().forEach(context);

//module.exports = context;
//
//
// require all `test/components/**/index.js`
var testsContext = require.context('.', false, /.+\.spec\.js?$/);

testsContext.keys().forEach(testsContext);

// require all `src/components/**/index.js`
var componentsContext = require.context('../src', false, /.+\.js?$/);

componentsContext.keys().forEach(componentsContext);
