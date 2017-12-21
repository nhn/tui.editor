/**
 * @fileoverview test bundle
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
const componentsContext = require.context('../src/js', true, /.+\.js?$/);

componentsContext.keys().forEach(componentsContext);

const testsContext = require.context('.', true, /.+\.spec\.js?$/);

testsContext.keys().forEach(testsContext);
