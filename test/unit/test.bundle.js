/**
 * @fileoverview test bundle
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const testsContext = require.context('.', true, /.+\.spec\.js?$/);

testsContext.keys().forEach(testsContext);
