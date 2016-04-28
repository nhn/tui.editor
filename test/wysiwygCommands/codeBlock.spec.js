'use strict';

var WysiwygEditor = require('../../src/js/wysiwygEditor'),
    CodeBlock = require('../../src/js/wysiwygCommands/codeBlock'),
    EventManager = require('../../src/js/eventManager');

describe('CodeBlock', function() {
    var wwe, sq, $body;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();

        sq = wwe.getEditor();
        $body = wwe.get$Body();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add CodeBlock', function() {
        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('code').length).toEqual(1);
    });
    it('add CodeBlock with language', function() {
        CodeBlock.exec(wwe, 'javascript');

        expect($body.find('pre').hasClass('te-content-codeblock-1')).toBe(true);
        expect($body.find('pre').attr('data-language')).toEqual('javascript');
    });
});
