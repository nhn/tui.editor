'use strict';

var TuiEditor = require('../../src/js/editor');

var loadStyleFixtures = window.loadStyleFixtures;

xdescribe('scrollFollow', function() {
    var ned;

    beforeEach(function() {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        $('body').html('<div id="editSection"></div>');

        ned = new TuiEditor({
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
                }
            }
        });
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    describe('disable/enable, 어찌테스트해야할지 고민중', function() {
        beforeEach(function() {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));
        });

        it('disable scrollFollow', function() {
            ned.exec('scrollFollow.diasable');
        });
    });
});
