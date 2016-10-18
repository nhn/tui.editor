import TuiEditor from '../../src/js/editor';
import ScrollSync from '../../src/js/extensions/scrollFollow.scrollSync';
import SectionManager from '../../src/js/extensions/scrollFollow.sectionManager';

const loadStyleFixtures = window.loadStyleFixtures;

describe('scrollFollow.ScrollSync', () => {
    let ned, sectionManager, scrollSync;

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
                    $('.te-preview').css('padding', '0');
                    $('.te-preview').css('overflow', 'auto');
                    sectionManager = new SectionManager(editor.getCodeMirror(), editor.preview);
                    scrollSync = new ScrollSync(sectionManager, editor.getCodeMirror(), editor.preview.$el);
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

    describe('get scroll data for preview from markdown', () => {
        beforeEach(() => {
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

        it('get section by markdown scroll top', () => {
            const cm = ned.getCodeMirror();
            cm.scrollTo(0, Math.ceil(cm.heightAtLine(1, 'local')));

            const scrollFactors = scrollSync._getScrollFactorsOfEditor();

            expect(scrollFactors.section.end).toEqual(4);
            expect(scrollFactors.sectionRatio).not.toEqual(0);
        });

        it('if editor scroll to bottom then return isEditorBottom === true ', () => {
            const cm = ned.getCodeMirror();
            cm.scrollTo(0, cm.heightAtLine(12, 'local'));

            const scrollFactors = scrollSync._getScrollFactorsOfEditor();

            expect(scrollFactors.isEditorBottom).toBe(true);
        });
    });

    describe('running animation', () => {
        it('call step callback function', () => {
            const stepCallback = jasmine.createSpy('stepCallback');
            scrollSync._animateRun(0, 10, stepCallback);

            expect(stepCallback).toHaveBeenCalled();
        });

        it('value', done => {
            const values = [];

            scrollSync._animateRun(0, 100, value => {
                values.push(value);

                if (value === 100) {
                    expect(values.length).toBeGreaterThan(1);
                    done();
                }
            });
        });
    });

    describe('sync preview scroll by markdown scroll top', () => {
        it('get preview scrollTop that synced with markdown scroll top', done => {
            const cm = ned.getCodeMirror();

            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            const previewScrollTop = scrollSync.$previewContainerEl.scrollTop();

            ned.on('previewRenderAfter', () => {
                sectionManager.sectionMatch();
                cm.scrollTo(0, cm.heightAtLine(3, 'local'));

                scrollSync.syncPreviewScrollTopToMarkdown();

                expect(scrollSync.$previewContainerEl.scrollTop()).not.toEqual(previewScrollTop);

                done();
            });
        });

        it('if scroll factors have something wrong, dont scroll control', done => {
            const cm = ned.getCodeMirror();

            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            const previewScrollTop = scrollSync.$previewContainerEl.scrollTop();

            ned.on('previewRenderAfter', () => {
                sectionManager.sectionMatch();

                sectionManager.getSectionList().forEach(section => {
                    section.$previewSectionEl = null;
                });

                cm.scrollTo(0, cm.heightAtLine(1, 'local'));

                scrollSync.syncPreviewScrollTopToMarkdown();

                expect(scrollSync.$previewContainerEl.scrollTop()).toEqual(previewScrollTop);

                done();
            });
        });
    });

    describe('Hidden codemirror', () => {
        it('if codemirror invisible so return scrollInfo incorrectly than use saved scrollInfo', () => {
            const cm = ned.getCodeMirror();

            ned.setValue([
                'paragraph',
                '# header1',
                'paragraph',
                'paragraph',
                '## header2',
                'paragraph'
            ].join('\n'));

            sectionManager.makeSectionList();

            scrollSync.saveScrollInfo();

            cm.scrollTo(0, cm.heightAtLine(6, 'local'));

            cm.getWrapperElement().style.display = 'none';

            const scrollInfo = cm.getScrollInfo();

            expect(scrollSync._fallbackScrollInfoIfIncorrect(scrollInfo)).toBe(scrollSync._savedScrollInfo);
        });
    });
});
