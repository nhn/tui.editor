'use strict';

var AddLink = require('../../src/js/wysiwygCommands/addLink'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('AddLink', function() {
    var wwe;

    beforeEach(function() {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init();
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add link to current selection', function() {
        var range = wwe.getEditor().getSelection().cloneRange();

        wwe.setValue('line');

        range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
        wwe.getEditor().setSelection(range);

        AddLink.exec(wwe, {url: '#url', text: 'inputText'});

        expect(wwe.get$Body().find('a').length).toEqual(1);
        expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
        expect(wwe.get$Body().find('a').text()).toEqual('line');
    });

    it('add link with no selection text', function() {
        AddLink.exec(wwe, {url: '#url', linkText: 'inputText'});

        expect(wwe.get$Body().find('a').length).toEqual(1);
        expect(wwe.get$Body().find('a').attr('href')).toEqual('#url');
        expect(wwe.get$Body().find('a').text()).toEqual('inputText');
    });
});
