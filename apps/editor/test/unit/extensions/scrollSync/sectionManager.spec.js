/**
 * @fileoverview test scroll sync manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import TuiEditor from '@/editor';
import SectionManager from '@/extensions/scrollSync/sectionManager';

describe('sectionManager', () => {
  let ned, sectionManager, container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('node_modules/codemirror/lib/codemirror.css');
    container = document.createElement('div');
    document.body.appendChild(container);

    ned = new TuiEditor({
      el: container,
      previewStyle: 'vertical',
      height: '150px',
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

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      container.parentNode.removeChild(container);
      done();
    });
  });

  describe('sectionManager', () => {
    describe('getSectionList()', () => {
      it('should make section list if it has not been made', () => {
        sectionManager._sectionList = null;

        ned.setValue('text 1\ntext 2');

        const sectionList = sectionManager.getSectionList();

        expect(sectionList).not.toBeNull();
      });
    });

    it('make new section', () => {
      sectionManager._sectionList = [];

      sectionManager._addNewSection(0, 1);

      const sectionList = sectionManager.getSectionList();

      expect(sectionList.length).toBe(1);
      expect(sectionList[0].start).toBe(0);
      expect(sectionList[0].end).toBe(1);
    });

    it('update current section', () => {
      sectionManager._sectionList = [];
      sectionManager._addNewSection(0, 1);
      sectionManager._updateCurrentSectionEnd(3);

      expect(sectionManager.getSectionList()[0].end).toBe(3);
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

      expect(lineType[0]).toBe(false);
      expect(lineType[1]).toBe(true);
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
      expect(lineType[2]).toBe(false);
      expect(lineType[3]).toBe(true);
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

      expect(sectionManager.getSectionList().length).toBe(3);
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

      expect(sectionManager.getSectionList().length).toBe(2);
    });

    it('make section list with default section ', () => {
      ned.setValue([
        ' ',
        '***',
        'paragraph'
      ].join('\n'));

      sectionManager.makeSectionList();

      expect(sectionManager.getSectionList().length).toBe(1);
    });

    it('make section list use default section if first contents is header ', () => {
      ned.setValue([
        '# header',
        '***',
        'paragraph'
      ].join('\n'));

      sectionManager.makeSectionList();

      expect(sectionManager.getSectionList().length).toBe(1);
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

      expect(sectionManager.getSectionList().length).toBe(3);
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

      expect(sectionManager.getSectionList().length).toBe(2);
    });

    it('dont make section with line synced by table', () => {
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

      expect(sectionManager.getSectionList().length).toBe(2);
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

      expect(sectionManager.getSectionList().length).toBe(2);
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

      expect(sectionManager.getSectionList().length).toBe(2);
    });

    it('dont make section with line synced by codeBlock', () => {
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

      expect(sectionManager.getSectionList().length).toBe(2);
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

      expect(sectionList[0].start).toBe(0);
      expect(sectionList[0].end).toBe(0);
      expect(sectionList[1].start).toBe(1);
      expect(sectionList[1].end).toBe(3);
      expect(sectionList[2].start).toBe(4);
      expect(sectionList[2].end).toBe(5);
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

        expect(sectionList.length).toBe(3);
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

    it('should not create a section for setext heading with quote', () => {
      ned.setValue([
        'text',
        '> quote',
        '---'
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[0]);
    });

    it('create new section of image where at root level', () => {
      ned.setValue([
        'paragraph',
        '# header1',
        'paragraph',
        'paragraph',
        '',
        '![nhn](http://www.nhn.com)',
        '',
        '## header2',
        'paragraph'
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(5)).toBe(sectionList[2]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[3]);
    });

    it('do not new section of image where at non root level & paragraph first child', () => {
      ned.setValue([
        'paragraph',
        '# header1',
        'paragraph',
        'paragraph',
        '* NHN EnterTainment ![nhn](http://www.nhn.com)',
        'NHN EnterTainment ![nhn](http://www.nhn.com)',
        '## header2',
        'paragraph'
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(4)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(5)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[2]);
    });

    it('do not create new section of image where at non root level', () => {
      ned.setValue([
        'paragraph',
        '# header1',
        'paragraph',
        'paragraph',
        'asdNHN EnterTainment ![nhn](http://www.nhn.com)',
        '* NHN EnterTainment ![nhn](http://www.nhn.com)',
        '* [ ] NHN EnterTainment ![nhn](http://www.nhn.com)',
        '1. NHN EnterTainment ![nhn](http://www.nhn.com)',
        '- NHN EnterTainment ![nhn](http://www.nhn.com)',
        '> NHN EnterTainment ![nhn](http://www.nhn.com)',
        '>> NHN EnterTainment ![nhn](http://www.nhn.com)',
        '```',
        '![nhn](http://www.nhn.com)',
        '```',
        '## header2',
        'paragraph'
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(4)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(5)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(6)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(7)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(8)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(9)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(10)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(11)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(12)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(13)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[2]);
    });

    it('should create new image section right after two codeblocks that without line breaks between', () => {
      ned.setValue([
        '``` js',
        'var a = 10;',
        '```',
        '``` js',
        'var b = 20;',
        '```',
        '',
        '![nhn](http://www.nhn.com)',
        ''
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(7)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[1]);
    });

    it('do not create new section right after image that line has no content', () => {
      ned.setValue([
        '![nhn](http://www.nhn.com)',
        ''
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[0]);
    });

    it('should create new section on sequential image', () => {
      ned.setValue([
        '![nhn](http://www.nhn.com)',
        '',
        '![nhn](http://www.nhn.com)',
        '',
        '',
        '',
        '![nhn](http://www.nhn.com)',
        '',
        '',
        '',
        '![nhn](http://www.nhn.com)',
        '',
        '',
        '![nhn](http://www.nhn.com)<br>',
        '<br>',
        '![nhn](http://www.nhn.com)',
        '',
        '',
        '# heading',
        '',
        ''
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(2)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(4)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(5)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(6)).toBe(sectionList[2]);
      expect(sectionManager.sectionByLine(7)).toBe(sectionList[2]);
      expect(sectionManager.sectionByLine(8)).toBe(sectionList[2]);
      expect(sectionManager.sectionByLine(9)).toBe(sectionList[2]);
      expect(sectionManager.sectionByLine(10)).toBe(sectionList[3]);
      expect(sectionManager.sectionByLine(13)).toBe(sectionList[4]);
      expect(sectionManager.sectionByLine(14)).toBe(sectionList[5]);
      expect(sectionManager.sectionByLine(15)).toBe(sectionList[5]);
      expect(sectionManager.sectionByLine(16)).toBe(sectionList[5]);
      expect(sectionManager.sectionByLine(18)).toBe(sectionList[6]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[6]);
    });
    it('should create new section on spaced image', () => {
      ned.setValue([
        ' ![nhn](http://www.nhn.com)',
        '',
        '  ![nhn](http://www.nhn.com)',
        ''
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(2)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[1]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[1]);
    });
    it('should create new section on non independent inline image', () => {
      ned.setValue([
        'This is ![nhn](http://www.nhn.com) official logo.',
        '',
        'And here is too ![nhn](http://www.nhn.com).',
        ''
      ].join('\n'));

      sectionManager.makeSectionList();
      const sectionList = sectionManager.getSectionList();

      expect(sectionManager.sectionByLine(0)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(1)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(2)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(3)).toBe(sectionList[0]);
      expect(sectionManager.sectionByLine(99999)).toBe(sectionList[0]);
    });
  });
});
