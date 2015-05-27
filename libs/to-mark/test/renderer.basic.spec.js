'use strict';

var basicRenderer = require('../src/renderer.basic'),
    toDom = require('../src/toDom'),
    DomRunner = require('../src/domRunner');

describe('basicRenderer', function() {
    var runner,
        result;

    describe('Headings', function() {
        it('H1', function() {
            runner = new DomRunner(toDom('<h1>heading</h1>'));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# heading');
        });

        it('H1 EM', function() {
            runner = new DomRunner(toDom('<h1><em>heading</em></h1>'));
            runner.next();
            result = basicRenderer.convert(runner);
            expect(result).toEqual('# *heading*');
        });
    });
});
