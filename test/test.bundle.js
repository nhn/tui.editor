/**
 * @fileoverview test bundle
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const testsContext = require.context('.', true, /.+\.spec\.js?$/);

testsContext.keys().forEach(testsContext);
