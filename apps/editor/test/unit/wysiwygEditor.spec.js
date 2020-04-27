/**
 * @fileoverview test wysiwyg editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import ListManager from '@/wwListManager';
import { isMac } from '@/utils/common';

const sanitizer = jasmine.createSpy('sanitizer');

describe('WysiwygEditor', () => {
  let container, em, wwe;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();

    wwe = new WysiwygEditor(container, em, { sanitizer });

    wwe.init();
    wwe.editor.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      done();
    });
  });

  describe('reset()', () => {
    it('set content blank', () => {
      wwe.setValue('<h1>HELLO WORLD</h1>');
      wwe.reset();
      expect(wwe.getValue()).toEqual('<br />');
    });
  });

  describe('managing key event handlers', () => {
    beforeEach(() => {
      wwe.componentManager.addManager('list', ListManager);
    });

    it('add key event handler and run', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler(handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      expect(handler).toHaveBeenCalled();
    });

    it('add key event with particular keymap and run', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler('HOME', handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      expect(handler).toHaveBeenCalled();
    });

    it('should take multiple keymaps as an array', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler(['HOME', 'END'], handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      em.emit('wysiwygKeyEvent', {
        keyMap: 'END',
        data: { keyCode: 0 }
      });
      expect(handler.calls.count()).toBe(2);
    });

    it('run particular keymap and default', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler('HOME', handler);
      wwe.addKeyEventHandler(handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      expect(handler.calls.count()).toEqual(2);
    });

    it('if handler returns false stop invoke next handler', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler('HOME', () => false);
      wwe.addKeyEventHandler('HOME', handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it('if defalut handler returns false dont invoke keymap handler', () => {
      const handler = jasmine.createSpy('keyEventHandler');

      wwe.addKeyEventHandler(() => false);

      wwe.addKeyEventHandler('HOME', handler);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: { keyCode: 0 }
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it('should insert 4 spaces when "TAB" pressed', () => {
      wwe.getEditor().setHTML('');

      em.emit('wysiwygKeyEvent', {
        keyMap: 'TAB',
        data: {
          preventDefault: () => {}
        }
      });

      expect(
        $(wwe.getBody())
          .find('div')
          .text()
      ).toBe('\u00a0\u00a0\u00a0\u00a0');
    });

    it('should not insert 4 spaces when "TAB" pressed in list item', () => {
      const range = wwe.getEditor().getSelection();

      wwe.getEditor().setHTML('<ul><li><div><br></div></li></ul>');

      range.setStart(wwe.getBody().querySelectorAll('li>div')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'TAB',
        data: {
          preventDefault: () => {}
        }
      });

      expect(
        $(wwe.getBody())
          .find('div')
          .text()
      ).toBe('');
    });

    it('should not insert 4 spaces when "TAB" pressed in task list', () => {
      const range = wwe.getEditor().getSelection();

      wwe
        .getEditor()
        .setHTML(
          '<ul><li class="task-list-item"><div><input type="checkbox"/><br></div></li></ul>'
        );

      range.setStartAfter(wwe.getBody().querySelectorAll('div>input')[0]);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'TAB',
        data: {
          preventDefault: () => {}
        }
      });

      expect(
        $(wwe.getBody())
          .find('div')
          .text()
      ).toBe('');
    });
  });

  describe('Event', () => {
    beforeEach(done => {
      // wait for squire events routine
      setTimeout(() => {
        done();
      }, 0);
    });

    it('when something changed in editor Emit contentChangedFromWysiwyg event', done => {
      em.listen('contentChangedFromWysiwyg', editor => {
        expect(editor).toBe(wwe);
        done();
      });

      wwe.editor.insertHTML('<p>test</p>');
    });

    it('when something changed in editor Emit change.wysiwygEditor event', done => {
      // events of squire are asynchronous
      em.listen('changeFromWysiwyg', () => {
        done();
      });

      wwe.editor.insertPlainText('t');
    });

    it('when something changed in editor Emit change event', done => {
      // squire event fire asynchronous
      em.listen('change', ev => {
        expect(ev.source).toEqual('wysiwyg');
        done();
      });

      wwe.editor.insertHTML('t');
    });

    it('should not fire change event when getValue', done => {
      em.listen('change', fail);
      wwe.getValue();
      setTimeout(done, 100);
    });

    it('when editor gain focus, emit focus event', () => {
      em.listen('focus', ev => {
        expect(ev.source).toEqual('wysiwyg');
      });

      wwe.editor.focus();
    });

    it('when editor lost focus, emit blur event', () => {
      em.listen('blur', ev => {
        expect(ev.source).toEqual('wysiwyg');
      });

      wwe.editor.blur();
    });

    xit('fire stateChange event when state changed', () => {
      em.listen('stateChange', data => {
        expect(data.strong).toBe(true);
      });

      wwe.editor.modifyDocument(() => {
        wwe.editor.insertPlainText('test');
      });

      wwe.editor.bold();
    });
  });

  describe('getValue, setValue', () => {
    it('remove all unnecessary brs', () => {
      const html = '<h1>1</h1><h1>2</h1>';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual('<h1>1</h1><h1>2</h1><br />');
    });

    it('dont remove necessary brs', () => {
      const html = '<h1>1</h1><div><br></div><h1>2</h1>';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual('<h1>1</h1><br /><h1>2</h1><br />');
    });

    it('remove contentEditable block tag(div)', () => {
      const html = 'abcde<br />efg';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual('abcde<br />efg<br />');
    });

    it('should remove contentEditable block tag(div) even it has attributes', () => {
      const html = '<div class="some-class">text</div>';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual('text<br />');
    });

    it('empty line replace to br', () => {
      const html = '<div><br /></div>test';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual('<br />test<br />');
    });

    it('empty line li dont replace to br', () => {
      const html = '<ul><li></li></ul>';

      wwe.setValue(html);
      expect(wwe.getValue()).toEqual(`${html}<br />`);
    });

    it('should replace space(32) to &nbsp; in the front/back span tag', () => {
      const html = [
        '<span class="color1">aaa </span>',
        '<span class="color2">bbb</span>',
        '<span class="color3"> ccc</span>'
      ].join('');

      wwe.setValue(html);

      const expectedHtml = [
        '<span class="color1">aaa&nbsp;</span>',
        '<span class="color2">bbb</span>',
        '<span class="color3">&nbsp;ccc</span>'
      ].join('');

      expect(wwe.getValue()).toEqual(`${expectedHtml}<br />`);
    });

    it('the line break is working between <br> to <img>.', () => {
      let html = '<p>test<br><img src="" alt="image"></p>';

      wwe.setValue(html);

      expect(wwe.getBody().querySelectorAll('div').length).toEqual(3);
      expect(
        $(wwe.getBody())
          .find('div')
          .eq(0)
          .text()
      ).toEqual('test');
      expect(
        $(wwe.getBody())
          .find('div')
          .eq(1)
          .find('img').length
      ).toEqual(1);

      html = 'test<br>\n<img src="" alt="image">';
      wwe.setValue(html);

      expect(wwe.getBody().querySelectorAll('div').length).toEqual(2);
      expect(
        $(wwe.getBody())
          .find('div')
          .eq(0)
          .text()
      ).toEqual('test');
      expect(
        $(wwe.getBody())
          .find('div')
          .eq(1)
          .find('img').length
      ).toEqual(1);
    });

    it('record undo state after all setValue process not setHTML', done => {
      const html = '<ul><li>test</li></ul>';

      em.listen('wysiwygSetValueAfter', () => {
        wwe.getBody().innerHTML = '<h2>test<br></h2>';
      });

      wwe.setValue(html);

      setTimeout(() => {
        wwe.getEditor().insertHTML('<h1>test</h1>');
        setTimeout(() => {
          wwe.getEditor().undo();
          expect(wwe.getBody().querySelectorAll('h1').length).toEqual(0);
          expect(wwe.getBody().querySelectorAll('h2').length).toEqual(1);
          done();
        }, 0);
      }, 0);
    });

    it('move cursor to end after setValue() cuz we need new range after whole conntent changed', () => {
      wwe.setValue('<ul><li><div>test</div></li></ul><div>test2<br></div>');
      const range = wwe.getRange();

      expect(range.startContainer).toBe(wwe.getBody().querySelectorAll('div')[1]);
      expect(range.startOffset).toEqual(1);
    });

    it('should not move cursor to end after setValue() if `cursorToEnd` param is set to false', () => {
      wwe.setValue('<ul><li><div>test</div></li></ul><div>test2<br></div>', false);
      const range = wwe.getRange();

      expect(range.startContainer).not.toBe(wwe.getBody().querySelectorAll('div')[1]);
      expect(range.startOffset).not.toEqual(1);
    });
  });

  describe('insertText()', () => {
    let sqe, selection, body;

    beforeEach(() => {
      sqe = wwe.getEditor();
      selection = sqe.getSelection().cloneRange();
      body = sqe.getBody();
    });

    it('to cursor position', () => {
      sqe.setHTML('<div>text  here<br/></div>');

      selection.setStart(body.querySelector('div').firstChild, 5);
      selection.collapse(true);
      sqe.setSelection(selection);

      wwe.insertText('insert');

      expect(body.textContent).toEqual('text insert here');
    });

    it('to selected area', () => {
      sqe.setHTML('<div>text here<br/></div>');

      selection.setStart(body.querySelector('div').firstChild, 5);
      selection.setEnd(body.querySelector('div').firstChild, 9);
      sqe.setSelection(selection);

      wwe.insertText('replaced');

      expect(body.textContent).toEqual('text replaced');
    });
  });

  it('getBody() get current wysiwyg iframe body that wrapped jquery', () => {
    expect(wwe.getBody()).not.toBeUndefined();
    expect(wwe.getBody().tagName).toEqual('DIV');
    expect($(wwe.getBody()).hasClass('tui-editor-contents')).toBe(true);
  });

  it('hasFormatWithRx() check hasFormat with RegExp', () => {
    wwe.setValue('<h1>hasHeading</h1>');
    expect(wwe.hasFormatWithRx(/h[\d]/i)[0]).toEqual('H1');
  });

  describe('_wrapDefaultBlockTo', () => {
    it('wrap selection defulat block', done => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe.getBody().innerHTML = 'abcdef';

      range.setStart(wwe.getBody().firstChild, 4);
      range.collapse(true);
      wwe._wrapDefaultBlockTo(range);

      expect(
        wwe
          .getEditor()
          .getHTML()
          .replace(/<br \/>|<br>/g, '')
      ).toEqual('<div>abcdef</div>');
      done();
    });
  });

  describe('breakToNewDefaultBlock()', () => {
    it('make new defulatBlock then move selection to it', () => {
      wwe.getBody().innerHTML = '<div>aef<br></div>';

      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody(), 0);
      range.collapse(true);
      wwe.breakToNewDefaultBlock(range);

      expect(wwe.getEditor().getHTML()).toEqual('<div>aef<br></div><div><br></div>');
      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
      expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
    });

    it('make new defulatBlock to body child then move selection to it', () => {
      wwe.getBody().innerHTML = '<h1><div>aef<br></div></h1>';

      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      // select text node
      range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
      range.collapse(true);
      wwe.breakToNewDefaultBlock(range);

      expect(wwe.getEditor().getHTML()).toEqual('<h1><div>aef<br></div></h1><div><br></div>');
      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
      expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
    });
  });

  describe('unwrapBlockTag()', () => {
    it('unwrap tag of current selection with tag name', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe.getBody().innerHTML = '<h1><div>test<br></div></h1>';

      range.selectNode(wwe.getBody().querySelectorAll('div')[0].firstChild);
      range.collapse(true);
      wwe.getEditor().setSelection(range);
      wwe.unwrapBlockTag('H1');

      expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('test');
    });

    it('unwrap tag of current selection with condition callback', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe.getBody().innerHTML = '<h1><div>test<br></div></h1>';

      range.selectNode(wwe.getBody().querySelectorAll('div')[0].firstChild);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      wwe.unwrapBlockTag(tagName => tagName === 'H1');

      expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
    });
  });

  describe("replace node's content text", () => {
    it('replace text without affect tags', () => {
      wwe.getBody().innerHTML = '<ul><li class="custom-class">list1</li><li>list2</li></ul>';

      wwe.replaceContentText(wwe.getBody().querySelectorAll('li')[0], 'list1', 'list2');

      expect(wwe.getValue().replace(/<br \/>/g, '')).toBe(
        '<ul><li class="custom-class">list2</li><li>list2</li></ul>'
      );
    });
  });

  describe('focus()', () => {
    it('focus to ww editor', () => {
      wwe.getEditor().focus = jasmine.createSpy('focus');
      wwe.focus();
      expect(wwe.getEditor().focus).toHaveBeenCalled();
    });
  });

  describe('move cursor to start, and', () => {
    beforeEach(() => {
      wwe.setHeight(30);
    });
    it('move cursor to end and scroll to end', () => {
      wwe.setValue(
        'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
      );
      wwe.moveCursorToEnd();

      const range = wwe.getRange();

      expect(wwe.scrollTop()).not.toEqual(0);
      expect(range.startContainer).toEqual(wwe.getBody().lastChild);
      expect(range.startOffset).toEqual(1);
    });
    it('move cursor to start and scroll to top', () => {
      wwe.setValue(
        'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
      );
      wwe.moveCursorToEnd();
      wwe.moveCursorToStart();

      const range = wwe.getRange();

      expect(wwe.scrollTop()).toEqual(0);
      expect(range.startContainer).toEqual(wwe.getBody().querySelectorAll('div')[0].firstChild);
      expect(range.startOffset).toEqual(0);
    });
  });

  it('scroll if needed on wysiwygRangeChangeAfter', () => {
    wwe.setHeight(30);
    wwe.setValue(
      'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
    );
    wwe.scrollTop(0);

    em.emit('wysiwygRangeChangeAfter');

    expect(wwe.scrollTop()).not.toEqual(0);
  });

  describe('get current range', () => {
    it('get range', () => {
      const range = wwe.getEditor().getSelection();

      expect(wwe.getRange()).toEqual(range);
    });
  });

  describe('defer()', () => {
    it('should run passed callback on next frame', done => {
      let count = 0;

      wwe.defer(() => {
        expect(count).toEqual(1);
        done();
      });

      count += 1;
    });

    it('should not run passed callback on next frame if editor is not valid #1', () => {
      wwe.defer(() => {
        fail('defer() callback has been called');
      });

      wwe.remove();
    });

    it('should not run passed callback on next frame if editor is not valid #2', () => {
      wwe.defer(() => {
        fail('defer() callback has been called');
      });

      const element = wwe.editorContainerEl;

      element.parentNode.removeChild(element);
    });
  });

  it('should blocks squire default key handlers', () => {
    const sqe = wwe.getEditor();
    const meta = isMac ? 'meta' : 'ctrl';
    const spyOriginal = jasmine.createSpy('original');
    const spy = jasmine.createSpy('replace');
    const keyEvent = {
      keyCode: 66,
      preventDefault: spy
    };

    keyEvent[`${meta}Key`] = true;

    Object.getPrototypeOf(sqe._keyHandlers)[`${meta}-b`] = spyOriginal;
    sqe.fireEvent('keydown', keyEvent);

    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      expect(spyOriginal).not.toHaveBeenCalled();
    }, 1);
  });

  describe('scrollIntoCursor', () => {
    it('should scroll to cursor at the end', () => {
      wwe.setHeight(50);
      const sqe = wwe.getEditor();

      sqe.setHTML(
        '<div>a</div><div>a</div><div>a</div><div>a</div><div>a</div><div>a</div><div>a</div><div>a</div>'
      );
      sqe.moveCursorToEnd();

      wwe.scrollIntoCursor();

      const { top: cursorTop, height: cursorHeight } = sqe.getCursorPosition();
      const {
        top: editorTop,
        height: editorHeight
      } = wwe.editorContainerEl.getBoundingClientRect();

      expect(cursorTop >= 0).toBe(true);
      expect(cursorTop + cursorHeight <= editorTop + editorHeight).toBe(true);
    });

    it('should scroll to cursor at the first', () => {
      wwe.setHeight(50);
      const sqe = wwe.getEditor();

      sqe.setHTML(
        'a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>'
      );

      // scroll to bottom
      wwe.scrollTop(99999);

      sqe.moveCursorToStart();
      wwe.scrollIntoCursor();

      const { top: cursorTop, height: cursorHeight } = sqe.getCursorPosition();
      const {
        top: editorTop,
        height: editorHeight
      } = wwe.editorContainerEl.getBoundingClientRect();

      expect(cursorTop - editorTop >= 0).toBe(true);
      expect(cursorTop + cursorHeight <= editorTop + editorHeight).toBe(true);
    });
  });

  describe('isInTable ', () => {
    it('isInTable() check if passed range is in table', () => {
      const range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      wwe
        .getEditor()
        .setHTML(
          '<table><thead><tr><th><br></th><th><br></th></tr></thead>' +
            '<tbody><tr><td><br></td><td><br></td></tr></tbody></table>'
        );
      range.setStart(wwe.getBody().querySelectorAll('td')[0], 0);
      range.collapse(true);

      expect(wwe.isInTable(range)).toEqual(true);
    });
  });

  describe('inside code-block ', () => {
    it('enter key should not add link elements for URL-like string', () => {
      const sqe = wwe.getEditor();
      const range = sqe.getSelection().cloneRange();

      sqe.setHTML('<pre data-te-codeblock="">http://nhn.com</pre>');

      const codeBlock = wwe.getBody().querySelector('pre');
      const urlText = codeBlock.firstChild;

      range.setStartAfter(urlText);
      sqe.setSelection(range);

      sqe.fireEvent('keydown', {
        keyCode: 13,
        preventDefault: () => {}
      });

      expect(codeBlock.firstChild).toBe(urlText);
    });
  });

  it('getSanitizer()', () => {
    expect(wwe.getSanitizer()).toEqual(sanitizer);
  });
});
