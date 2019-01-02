/**
 * @fileoverview test wysiwyg hr manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwHrManager from '../../src/js/wwHrManager';
import Hr from '../../src/js/wysiwygCommands/hr';

describe('WwHrManager', () => {
  let $container, em, wwe, mgr;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();

    mgr = new WwHrManager(wwe);
    wwe.getEditor().focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
      done();
    });
  });

  describe('_removeHrOnEnter', () => {
    it('remove hr current selection is hr', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<div>abcd<br></div>');

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);
      Hr.exec(wwe);

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);

      mgr._removeHrOnEnter(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });

    it('remove hr if current is on first offset and previousSibling elemet is hr', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<hr><div>abcd<br></div>');

      range.setStart(wwe.get$Body()[0], 1);
      range.collapse(true);
      mgr._removeHrOnEnter(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });

    it('remove hr then set cursor to new block when nextSibling is not exists', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<div><b>abcd</b><<br></div><hr>');

      range.setStartAfter(wwe.get$Body().children().eq(1)[0]);
      range.collapse(true);
      mgr._removeHrOnEnter(range, {preventDefault: () => {}});

      const newRange = wwe.getEditor().getSelection();

      expect(wwe.get$Body().find('hr').length).toEqual(0);
      expect(newRange.startContainer.tagName).toEqual('DIV');
      expect(newRange.startOffset).toEqual(0);
    });

    it('remove hr then set cursor to new block if next sibling is exist', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<div><b>abcd</b><<br></div>');

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);
      Hr.exec(wwe);

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);

      mgr._removeHrOnEnter(range, {preventDefault: () => {}});

      const newRange = wwe.getEditor().getSelection();

      expect(wwe.get$Body().find('hr').length).toEqual(0);
      expect(newRange.startContainer.tagName).toEqual('DIV');
      expect(newRange.startOffset).toEqual(0);
    });
  });

  describe('_onTypedInHr', () => {
    it('if text content is typed in hr then break new block', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<div>abcd<br></div>');

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);
      Hr.exec(wwe);

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);

      mgr._removeHrOnBackspace(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });
  });

  describe('_removeHrOnBackspace()', () => {
    it('remove hr current selection is hr', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<div>abcd<br></div>');

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);

      wwe.getEditor().setSelection(range);
      Hr.exec(wwe);

      range.selectNode(wwe.get$Body().find('hr')[0]);
      range.collapse(true);

      mgr._removeHrOnBackspace(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });

    it('remove hr current selection\'s parentNode previousSibling is hr when offset 0', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<hr><div><b>abcd</b><<br></div>');

      range.setStart(wwe.get$Body().find('b')[0], 0);
      range.collapse(true);

      mgr._removeHrOnBackspace(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });

    it('remove hr if current is on first offset and previousSibling elemet is hr', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.setValue('<hr><div>abcd<br></div>');

      range.setStart(wwe.get$Body()[0], 1);
      range.collapse(true);
      mgr._removeHrOnBackspace(range, {preventDefault: () => {}});

      expect(wwe.get$Body().find('hr').length).toEqual(0);
    });
  });

  it('unwrap div on hr whene wysiwygSetValueAfter event fire', () => {
    wwe.getEditor().setHTML('<hr><h1>abcd</h1>');

    em.emit('wysiwygSetValueAfter');

    expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<hr><h1>abcd</h1>');
  });

  describe('_wrapDefaultBlockToOrphanTexts()', () => {
    it('wrap selection defulat block to all orphan texts', () => {
      wwe.get$Body().html('abcdef<div>ghijk<br></div>');

      mgr._wrapDefaultBlockToOrphanTexts();

      expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div><div>ghijk</div>');
    });
  });
});
