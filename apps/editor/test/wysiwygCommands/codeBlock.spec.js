'use strict';

var WysiwygEditor = require('../../src/js/wysiwygEditor'),
    CodeBlock = require('../../src/js/wysiwygCommands/codeBlock'),
    CodeBlockManager = require('../../src/js/wwCodeBlockManager'),
    EventManager = require('../../src/js/eventManager');

describe('CodeBlock', function() {
    var wwe, sq, $body;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, new EventManager());

        wwe.init();
        wwe.addManager('codeblock', CodeBlockManager);

        sq = wwe.getEditor();
        $body = wwe.get$Body();
        sq.focus();
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
        expect($body.find('pre div').length).toEqual(1);
        expect($body.find('pre').attr('data-te-codeblock')).toBeDefined();
    });
    it('add CodeBlock with language', function() {
        CodeBlock.exec(wwe, 'javascript');

        expect($body.find('pre').hasClass('te-content-codeblock-1')).toBe(true);
        expect($body.find('pre').attr('data-language')).toEqual('javascript');
    });
    it('add CodeBlock with selection', function() {
        var range;

        wwe.setValue('<div>hello, my name is code</div>');

        range = wwe.getEditor().getSelection();
        range.setStart(wwe.get$Body().children().eq(0)[0].firstChild, 0);
        range.setEnd(wwe.get$Body().children().eq(0)[0].firstChild, 5);

        sq.setSelection(range);

        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('pre div').length).toEqual(1);
        expect($body.find('div').eq(0).text()).toEqual('hello');
        expect($body.find('div').eq(1).text()).toEqual(', my name is code');
    });
});
