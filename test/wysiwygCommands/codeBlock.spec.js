'use strict';

var WysiwygEditor = require('../../src/js/wysiwygEditor'),
    CodeBlock = require('../../src/js/wysiwygCommands/codeBlock'),
    EventManager = require('../../src/js/eventManager');

describe('CodeBlock', function() {
    var wwe, sq, $body;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
            sq = wwe.getEditor();
            $body = wwe.get$Body();
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('add CodeBlock', function() {
        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('code').length).toEqual(1);
    });
    it('add CodeBlock with language', function() {
        CodeBlock.exec(wwe, 'javascript');

        expect($body.find('pre').hasClass('lang-javascript')).toBe(true);
        expect($body.find('pre').attr('data-language')).toEqual('javascript');
    });
});
