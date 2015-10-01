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

    describe('sectionManager', function() {
        it('make new section', function() {
            var sectionList;

            sectionManager._sectionList = [];

            sectionManager._addNewSection(0, 1);

            sectionList = sectionManager.getSectionList();

            expect(sectionList.length).toEqual(1);
            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(1);
        });

        it('update current section', function() {
            sectionManager._sectionList = [];
            sectionManager._addNewSection(0, 1);
            sectionManager._updateCurrentSectionEnd(3);

            expect(sectionManager.getSectionList()[0].end).toEqual(3);
        });

        it('iterate each line with info', function() {
            var lineType = [];

            ned.setValue([
                'paragraph',
                '# header1',
                ' ',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager._eachLineState(function(type, lineNumber) {
                lineType[lineNumber] = type;
            });

            expect(lineType[0]).toEqual('etc');
            expect(lineType[1]).toEqual('header');
        });

        it('make section list', function() {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(3);
        });

        it('section list have line info', function() {
            var sectionList;

            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            sectionList = sectionManager.getSectionList();

            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(0);
            expect(sectionList[1].start).toEqual(1);
            expect(sectionList[1].end).toEqual(3);
            expect(sectionList[2].start).toEqual(4);
            expect(sectionList[2].end).toEqual(5);
        });

         it('section match with preview', function(done) {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            ned.on('previewRenderAfter', function() {
                var sectionList;
                sectionManager.sectionMatch();
                sectionList = sectionManager.getSectionList();

                expect(sectionList.length).toEqual(3)
                expect(sectionList[0].$previewSectionEl.hasClass('content-id-0')).toBe(true);
                expect(sectionList[1].$previewSectionEl.hasClass('content-id-1')).toBe(true);
                expect(sectionList[2].$previewSectionEl.hasClass('content-id-2')).toBe(true);
                done();
            });
        });

        it('find section with markdown line', function() {
            var sectionList;

            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();
            sectionList = sectionManager.getSectionList();

            expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
            expect(sectionManager.sectionByLine(99999)).toBe(sectionList[2]);
        });

        it('find section with preview scroll top', function() {});
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
