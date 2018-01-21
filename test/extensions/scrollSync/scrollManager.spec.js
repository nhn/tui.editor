/**
 * @fileoverview test scroll manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import TuiEditor from '../../../src/js/editor';
import ScrollManager from '../../../src/js/extensions/scrollSync/scrollManager';
import SectionManager from '../../../src/js/extensions/scrollSync/sectionManager';

describe('ScrollManager', () => {
  let ned, sectionManager, scrollManager, container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures(
      'node_modules/codemirror/lib/codemirror.css',
      'src/css/tui-editor.css'
    );

    container = document.createElement('div');
    document.body.appendChild(container);

    ned = new TuiEditor({
      el: container,
      previewStyle: 'vertical',
      height: '120px',
      initialEditType: 'markdown',
      events: {
        'load': function(editor) {
          sectionManager = new SectionManager(editor.getCodeMirror(), editor.preview);
          scrollManager = new ScrollManager(sectionManager, editor.getCodeMirror(), editor.preview.$el);
        }
      }
    });
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
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

      const scrollFactors = scrollManager._getScrollFactorsOfEditor();

      expect(scrollFactors.section.end).toEqual(4);
      expect(scrollFactors.sectionRatio).not.toEqual(0);
    });

    it('if editor scroll to bottom then return isEditorBottom === true ', () => {
      const cm = ned.getCodeMirror();
      cm.scrollTo(0, cm.heightAtLine(12, 'local'));

      const scrollFactors = scrollManager._getScrollFactorsOfEditor();

      expect(scrollFactors.isEditorBottom).toBe(true);
    });
  });

  describe('running animation', () => {
    it('call step callback function', () => {
      const stepCallback = jasmine.createSpy('stepCallback');
      scrollManager._animateRun(0, 10, stepCallback);

      expect(stepCallback).toHaveBeenCalled();
    });

    it('value', done => {
      const values = [];

      scrollManager._animateRun(0, 100, value => {
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

      const previewScrollTop = scrollManager.$previewContainerEl.scrollTop();

      ned.on('previewRenderAfter', () => {
        sectionManager.sectionMatch();
        cm.scrollTo(0, cm.heightAtLine(3, 'local'));

        scrollManager.syncPreviewScrollTopToMarkdown();

        expect(scrollManager.$previewContainerEl.scrollTop()).not.toEqual(previewScrollTop);

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

      const previewScrollTop = scrollManager.$previewContainerEl.scrollTop();

      ned.on('previewRenderAfter', () => {
        sectionManager.sectionMatch();

        sectionManager.getSectionList().forEach(section => {
          section.$previewSectionEl = null;
        });

        cm.scrollTo(0, cm.heightAtLine(1, 'local'));

        scrollManager.syncPreviewScrollTopToMarkdown();

        expect(scrollManager.$previewContainerEl.scrollTop()).toEqual(previewScrollTop);

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

      scrollManager.saveScrollInfo();

      cm.scrollTo(0, cm.heightAtLine(6, 'local'));

      cm.getWrapperElement().style.display = 'none';

      const scrollInfo = cm.getScrollInfo();

      expect(scrollManager._fallbackScrollInfoIfIncorrect(scrollInfo)).toBe(scrollManager._savedScrollInfo);
    });
  });
});
