'use strict';

var NeonEditor = require('../../src/js/editor'),
    ScrollSync = require('../../src/js/extensions/scrollFollow.scrollSync'),
    SectionManager = require('../../src/js/extensions/scrollFollow.sectionManager');

describe('scrollFollow', function() {
    var ned, sectionManager, scrollSync;

    beforeEach(function(done) {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        $('body').html('<div id="editSection"></div>');

        ned = new NeonEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            events: {
                'load': function(editor) {
                    editor.getCodeMirror().setSize(200, 50);
                    $('.preview').css('padding', '0');
                    $('.preview').css('overflow', 'auto');
                    sectionManager = new SectionManager(editor.getCodeMirror(), editor.preview);
                    scrollSync = new ScrollSync(sectionManager, editor.getCodeMirror(), editor.preview.$el);
                    done();
                }
            }
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('scroll sync', function() {
        describe('get scroll data for preview from markdown', function() {
            beforeEach(function() {
                ned.setValue([
                    'paragraph',
                    '# header1',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    '## header2',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph',
                    'paragraph'
                ].join('\n'));

                sectionManager.makeSectionList();
            });

            it('get section by markdown scroll top', function() {
                var cm = ned.getCodeMirror(),
                    scrollFactors;

                cm.scrollTo(0, Math.ceil(cm.heightAtLine(1, 'local')));

                scrollFactors = scrollSync._getScrollFactorsOfEditor();

                expect(scrollFactors.section.end).toEqual(4);
                expect(scrollFactors.sectionRatio).not.toEqual(0);
            });

            it('maximum ratio is 0.9', function() {
                var cm = ned.getCodeMirror(),
                    scrollFactors;

                cm.scrollTo(0, cm.heightAtLine(0, 'local'));

                scrollFactors = scrollSync._getScrollFactorsOfEditor();

                expect(scrollFactors.section.end).toEqual(0);
                expect(scrollFactors.sectionRatio).toEqual(0);
            });

            it('if editor scroll to bottom then return isEditorBottom === true ', function() {
                var cm = ned.getCodeMirror(),
                    scrollFactors;

                cm.scrollTo(0, cm.heightAtLine(12, 'local'));

                scrollFactors = scrollSync._getScrollFactorsOfEditor();

                expect(scrollFactors.isEditorBottom).toBe(true);
            });
        });

        describe('sync preview scroll by markdown scroll top', function() {
            it('get preview scrollTop that synced with markdown scroll top', function(done) {
                var cm = ned.getCodeMirror(),
                    previewScrollTop;

                ned.setValue([
                    'paragraph',
                    '# header1',
                    'paragraph',
                    'paragraph',
                    '## header2',
                    'paragraph'
                ].join('\n'));

                sectionManager.makeSectionList();

                previewScrollTop = scrollSync.$previewContainerEl.scrollTop();

                ned.on('previewRenderAfter', function() {
                    sectionManager.sectionMatch();
                    cm.scrollTo(0, cm.heightAtLine(3, 'local'));

                    scrollSync.syncToPreview();

                    expect(scrollSync.$previewContainerEl.scrollTop()).not.toEqual(previewScrollTop);

                    done();
                });
            });

            it('animate preview scrolltop', function() {
            });
        });
        it('sync markdown scroll by preview scroll top', function() {});
    });

    describe('preview section', function() {

    });

    describe('sync scroll', function() {

    });
});
