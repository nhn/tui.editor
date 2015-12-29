'use strict';

var WysiwygEditor = require('../src/js/wysiwygEditor'),
    EventManager = require('../src/js/eventManager'),
    WwPManager = require('../src/js/wwPManager');

describe('WwPManager', function() {
    var $container, em, wwe;

    beforeEach(function(done) {
        $container = $('<div />');

        $('body').append($container);

        em = new EventManager();

        wwe = new WysiwygEditor($container, null, em);

        wwe.init(function() {
            wwe.getEditor()._ignoreChange = true;
            wwe._pMgr = new WwPManager(wwe);
            done();
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('make p tag to div default block when wysiwygSetValueAfter event fire', function() {
        wwe.getEditor().setHTML('<p>text1</p>');
        em.emit('wysiwygSetValueAfter');
        expect(wwe.get$Body().find('div').length).toEqual(1);
        expect(wwe.get$Body().find('p').length).toEqual(0);
        expect(wwe.get$Body().find('div')[0].textContent).toEqual('text1');
    });
});
