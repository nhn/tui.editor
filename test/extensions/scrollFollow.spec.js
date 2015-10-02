'use strict';

var NeonEditor = require('../../src/js/editor');

var loadStyleFixtures = window.loadStyleFixtures;

xdescribe('scrollFollow', function() {
    var ned;

    beforeEach(function(done) {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css')
        $('body').html('<div id="editSection"></div>');

        ned = new NeonEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            exts: ['scrollFollow'],
            events: {
                'load': function(editor) {
                    editor.getCodeMirror().setSize(200, 50);
                    $('.preview').css('padding', '0');
                    $('.preview').css('overflow', 'auto');
                    done();
                }
            }
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    it('how could i test it?', function() {
        expect(ned).toHaveDefined();
    });
});
