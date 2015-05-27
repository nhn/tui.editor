'use strict';

var Renderer = require('../src/renderer'),
    DomRunner = require('../src/domRunner'),
    toDom = require('../src/toDom');

describe('renderer', function() {
    var runner;

    beforeEach(function() {
        runner = new DomRunner(toDom('<h1>test</h1>'));
        runner.next();
    });

    it('can take the rule to render', function() {
        var convertedText,
            renderer = Renderer.factory();

        renderer.addRule('H1, H2, H3, H4, H5, H6', function() {
            return 'mytext';
        });

        convertedText = renderer.convert(runner);

        expect(convertedText).toEqual('mytext');
    });

    it('add rules with factory', function() {
        var convertedText,
            renderer = Renderer.factory({
                'H1, H2, H3, H4, H5, H6': function() {
                    return 'mytext';
                }
            });

        convertedText = renderer.convert(runner);

        expect(convertedText).toEqual('mytext');
    });

    it('if there is no rule, conveter returns undefined', function() {
        var convertedText,
            renderer = Renderer.factory();

        convertedText = renderer.convert(runner);

        expect(convertedText).toBeUndefined();
    });
});
