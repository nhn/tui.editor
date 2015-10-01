'use strict';

var NeonEditor = require('../../src/js/editor');

describe('scrollFollow', function() {
    var ned, sectionManager, scrollSync;

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
                    sectionManager = editor.scrollFollow.sectionManager;
                    scrollSync = editor.scrollFollow.scrollSync;
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
});
