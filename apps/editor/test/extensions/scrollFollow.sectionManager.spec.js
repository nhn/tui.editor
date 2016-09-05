import TuiEditor from '../../src/js/editor';
import SectionManager from '../../src/js/extensions/scrollFollow.sectionManager';

const loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow.sectionManager', () => {
    let ned, sectionManager;

    beforeEach(() => {
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
    afterEach(done => {
        setTimeout(() => {
            $('body').empty();
            done();
        });
    });

    describe('sectionManager', () => {
        it('make new section', () => {
            sectionManager._sectionList = [];

            sectionManager._addNewSection(0, 1);

            const sectionList = sectionManager.getSectionList();

            expect(sectionList.length).toEqual(1);
            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(1);
        });

        it('update current section', () => {
            sectionManager._sectionList = [];
            sectionManager._addNewSection(0, 1);
            sectionManager._updateCurrentSectionEnd(3);

            expect(sectionManager.getSectionList()[0].end).toEqual(3);
        });

        it('iterate each line with info', () => {
            const lineType = [];

            ned.setValue([
                'paragraph',
                '# header1',
                ' ',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager._eachLineState((isSection, lineNumber) => {
                lineType[lineNumber] = isSection;
            });

            expect(lineType[0]).toEqual(false);
            expect(lineType[1]).toEqual(true);
        });

        it('trimming top lines while _eachLineState', () => {
            const lineType = [];

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

            sectionManager._eachLineState((isSection, lineNumber) => {
                lineType[lineNumber] = isSection;
            });

            expect(lineType[0]).toBeUndefined();
            expect(lineType[1]).toBeUndefined();
            expect(lineType[2]).toEqual(false);
            expect(lineType[3]).toEqual(true);
        });


        it('make section list', () => {
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

        it('dont make section with only #', () => {
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

        it('make section list with default section ', () => {
            ned.setValue([
                ' ',
                '***',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(1);
        });

        it('make section list use default section if first contents is header ', () => {
            ned.setValue([
                '# header',
                '***',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(1);
        });


        it('make section list with setext type header ', () => {
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

        it('dont make section with line', () => {
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

        it('dont make section with line followed by table', () => {
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

        it('any problem with table in bottom', () => {
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

        it('any problem with table with space', () => {
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

        it('dont make section with line followed by codeBlock', () => {
            ned.setValue([
                'paragraph',
                'header1',
                '=======',
                '``` javascript',
                'const mm = 1;',
                '```',
                '------',
                'paragraph'
            ].join('\n'));


            sectionManager.makeSectionList();

            expect(sectionManager.getSectionList().length).toEqual(2);
        });

        it('section list have line info', () => {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            const sectionList = sectionManager.getSectionList();

            expect(sectionList[0].start).toEqual(0);
            expect(sectionList[0].end).toEqual(0);
            expect(sectionList[1].start).toEqual(1);
            expect(sectionList[1].end).toEqual(3);
            expect(sectionList[2].start).toEqual(4);
            expect(sectionList[2].end).toEqual(5);
        });

        it('section match with preview', done => {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            ned.on('previewRenderAfter', () => {
                sectionManager.sectionMatch();
                const sectionList = sectionManager.getSectionList();

                expect(sectionList.length).toEqual(3);
                expect(sectionList[0].$previewSectionEl.hasClass('content-id-0')).toBe(true);
                expect(sectionList[1].$previewSectionEl.hasClass('content-id-1')).toBe(true);
                expect(sectionList[2].$previewSectionEl.hasClass('content-id-2')).toBe(true);
                done();
            });
        });

        it('find section with markdown line', () => {
            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();
            const sectionList = sectionManager.getSectionList();

            expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
            expect(sectionManager.sectionByLine(99999)).toBe(sectionList[2]);
        });
    });
});
