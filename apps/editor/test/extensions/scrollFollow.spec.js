'use strict';

var NeonEditor = require('../../src/js/editor');

fdescribe('scrollFollow', function() {
    var ned, sectionManager;

    beforeEach(function(done) {
        $('body').html('<div id="editSection"></div>');

        ned = new NeonEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 300,
            initialEditType: 'markdown',
            exts: ['scrollFollow'],
            events: {
                'load': function(editor) {
                    sectionManager = editor.scrollFollow.sectionManager;
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
    });

    describe('preview section', function() {

    });

    describe('sync scroll', function() {

    });
});
