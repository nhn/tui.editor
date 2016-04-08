'use strict';

var TuiEditor = require('../../src/js/editor'),
    SectionManager = require('../../src/js/extensions/scrollFollow.sectionManager');

var loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow.sectionManager', function() {
    var ned, sectionManager;

    beforeEach(function() {
        jasmine.getStyleFixtures().fixturesPath = '/base';
        loadStyleFixtures('lib/codemirror/lib/codemirror.css');
        $('body').html('<div id="editSection"></div>');

        ned = new TuiEditor({
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

            sectionManager._eachLineState(function(isSection, lineNumber) {
                lineType[lineNumber] = isSection;
            });

            expect(lineType[0]).toEqual(false);
            expect(lineType[1]).toEqual(true);
        });

        it('trimming top lines while _eachLineState', function() {
            var lineType = [];

            ned.setValue([
                ' ',
                '',
                'paragraph',
                '# header1',
                ' ',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager._eachLineState(function(isSection, lineNumber) {
                lineType[lineNumber] = isSection;
            });

            expect(lineType[0]).toBeUndefined();
            expect(lineType[1]).toBeUndefined();
            expect(lineType[2]).toEqual(false);
            expect(lineType[3]).toEqual(true);
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

        it('dont make section with only #', function() {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                '##not header',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('make section list with default section ', function() {
            ned.setValue([
                ' ',
                '***',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(1);
        });

        it('make section list use default section if first contents is header ', function() {
            ned.setValue([
                '# header',
                '***',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(1);
        });


        it('make section list with setext type header ', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                'paragraph',
                'header2',
                '------',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(3);
        });

        it('dont make section with line', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                'paragraph',
                ' ',
                '------',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('dont make section with line followed by table', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                'paragraph',
                '| th | th |',
                '| -- | -- |',
                '| td | td |',
                '------',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('any problem with table in bottom', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                'paragraph',
                '| th | th |',
                '| -- | -- |',
                '| td | td |'
            ].join('\n'));

            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('any problem with table with space', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                'paragraph',
                '  | th | th |',
                '| -- | -- |',
                '| td | td |'
            ].join('\n'));

            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('dont make section with line followed by codeBlock', function() {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                '``` javascript',
                'var mm = 1;',
                '```',
                '------',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
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

                expect(sectionList.length).toEqual(3);
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
    });
});
