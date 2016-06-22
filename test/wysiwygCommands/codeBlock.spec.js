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
    it('add CodeBlock with selection', function() {
        var range;

        wwe.setValue('<div>hello, my name is code</div>');

        range = wwe.getEditor().getSelection();
        range.setStart(wwe.get$Body().children().eq(0)[0].firstChild, 0);
        range.setEnd(wwe.get$Body().children().eq(0)[0].firstChild, 5);

        sq.setSelection(range);

        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('code').length).toEqual(1);
        expect($body.find('code').text()).toEqual('hello');
        expect($body.find('div').eq(1).text()).toEqual(', my name is code');
    });
    it('add CodeBlock with table selection', function() {
        var range;

        wwe.setValue(['<div>default block</div>',
            '<table>',
            '<thead>',
            '<tr><td>000</td><td>000</td></tr>',
            '</thead>',
            '<tbody>',
            '<tr><td>111</td><td>111</td></tr>',
            '<tr><td>222</td><td>222</td></tr>',
            '<tr><td>333</td><td>333</td></tr>',
            '<tr><td>444</td><td>444</td></tr>',
            '</tbody>',
            '</table>'].join(''));

        range = wwe.getEditor().getSelection();
        range.setStartBefore(wwe.get$Body().children().eq(0)[0]);
        range.setEndAfter(wwe.get$Body().children().eq(1)[0]);

        sq.setSelection(range);

        CodeBlock.exec(wwe);

        expect($body.find('pre').length).toEqual(1);
        expect($body.find('code').length).toEqual(6);
        expect($body.find('code').eq(0).text()).toEqual('default block');
        expect($body.find('code').eq(1).text()).toEqual('000000');
        expect($body.find('code').eq(2).text()).toEqual('111111');
        expect($body.find('code').eq(3).text()).toEqual('222222');
        expect($body.find('code').eq(4).text()).toEqual('333333');
        expect($body.find('code').eq(5).text()).toEqual('444444');
    });
});
