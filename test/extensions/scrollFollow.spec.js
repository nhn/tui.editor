'use strict';

var NeonEditor = require('../../src/js/editor');

fdescribe('scrollFollow', function() {
    var ned, em, scrollFollow;

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
                    em = editor.eventManager;
                    scrollFollow = editor.scrollFollow;
                    done();
                }
            }
        });
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('markdown section list', function() {
        it('make new section', function() {
            var sectionList;

            scrollFollow._sectionList = [];

            scrollFollow._addNewSection(0, 1);

            sectionList = scrollFollow.getSectionList();

            expect(sectionList.length).toEqual(1);
            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(1);
        });

        it('update current section', function() {
            scrollFollow._sectionList = [];
            scrollFollow._addNewSection(0, 1);
            scrollFollow._updateCurrentSectionEnd(3);

            expect(scrollFollow.getSectionList()[0].end).toEqual(3);
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

            scrollFollow._eachLineState(function(type, lineNumber) {
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

            scrollFollow.makeSectionList();

            expect(scrollFollow.getSectionList().length).toEqual(3);
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

            scrollFollow.makeSectionList();

            sectionList = scrollFollow.getSectionList();

            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(0);
            expect(sectionList[1].start).toEqual(1);
            expect(sectionList[1].end).toEqual(3);
            expect(sectionList[2].start).toEqual(4);
            expect(sectionList[2].end).toEqual(5);
        });
    });

    describe('preview section', function() {

    });

    describe('sync scroll', function() {

    });
});
