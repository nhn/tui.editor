const testsContext = require.context('.', true, /\.spec\.js$/);

testsContext.keys().forEach(testsContext);
