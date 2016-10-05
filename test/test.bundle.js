const componentsContext = require.context('../src/js', true, /.+\.js?$/);

componentsContext.keys().forEach(componentsContext);

const testsContext = require.context('.', true, /.+\.spec\.js?$/);

testsContext.keys().forEach(testsContext);

