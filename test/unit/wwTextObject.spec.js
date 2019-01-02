/**
 * @fileoverview test wysiwyg text object
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WwTextObject from '../../src/js/wwTextObject';
import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';

describe('WwTextObject', () => {
  let wwe, sq, to;

  beforeEach(() => {
    const $container = $('<div />');

    $('body').append($container);

    wwe = new WysiwygEditor($container, new EventManager());

    wwe.init();

    sq = wwe.getEditor();

    sq.setHTML('test textObject');

    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  describe('set range', () => {
    beforeEach(() => {
      to = new WwTextObject(wwe);
    });

    it('if constructor has no range argument then use current range', () => {
      const range = sq.getSelection();
      expect(to._range).toEqual(range);
    });

    it('set with range', () => {
      const range = sq.getSelection();
      to.setRange(range);
      expect(to._range).toEqual(range);
    });
  });

  describe('Get text of range', () => {
    it('get text', () => {
      const range = wwe.getRange();

      range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
      range.setStart(range.startContainer, range.startOffset + 1);

      to = new WwTextObject(wwe, range);

      expect(to.getTextContent()).toEqual('est textObject');
    });

    it('get korean text', () => {
      const range = wwe.getRange();

      wwe.getEditor().setHTML('한글입니다.');

      range.selectNodeContents(wwe.get$Body().find('div')[0].firstChild);
      range.setStart(range.startContainer, range.startOffset + 1);

      to = new WwTextObject(wwe, range);

      expect(to.getTextContent()).toEqual('글입니다.');
    });
  });

  describe('Update range', () => {
    beforeEach(() => {
      const range = wwe.getRange();

      range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
      range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

      to = new WwTextObject(wwe, range);
    });
    it('set end before range', () => {
      const rangeChangeTo = wwe.getRange();

      rangeChangeTo.setStart(to._range.startContainer, 6);
      rangeChangeTo.collapse(true);

      to.setEndBeforeRange(rangeChangeTo);

      expect(to.getTextContent()).toEqual('est t');
    });
  });

  describe('Range expand', () => {
    beforeEach(() => {
      const range = wwe.getRange();

      range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
      range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

      to = new WwTextObject(wwe, range);
    });

    it('Expand start offset', () => {
      to.expandStartOffset();
      expect(to.getTextContent()).toEqual('tes');
    });
    it('Expand end offset', () => {
      to.expandEndOffset();
      expect(to.getTextContent()).toEqual('est');
    });
  });

  describe('Replace range with text', () => {
    beforeEach(() => {
      const range = wwe.getRange();

      range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
      range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

      to = new WwTextObject(wwe, range);
    });
    it('replace text', () => {
      to.replaceContent('12');
      expect(wwe.get$Body().find('div').text()).toEqual('t12t textObject');
    });
  });

  describe('Remove text content within range', () => {
    beforeEach(() => {
      const range = wwe.getRange();

      range.setStart(wwe.get$Body().find('div')[0].firstChild, 1);
      range.setEnd(wwe.get$Body().find('div')[0].firstChild, 3);

      to = new WwTextObject(wwe, range);
    });
    it('remove text', () => {
      to.deleteContent();
      expect(wwe.get$Body().find('div').text()).toEqual('tt textObject');
    });
  });

  describe('peek text content with given offset number', () => {
    beforeEach(() => {
      const range = wwe.getRange();

      range.setStart(wwe.get$Body().find('div')[0].firstChild, 7);
      range.setEnd(wwe.get$Body().find('div')[0].firstChild, 10);

      to = new WwTextObject(wwe, range);
    });

    it('peekStartBeforeOffset() returns text content from start with given offset to start offset', () => {
      expect(to.peekStartBeforeOffset(3)).toEqual(' te');
    });
  });
});
