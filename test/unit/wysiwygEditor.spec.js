/**
 * @fileoverview test wysiwyg editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import ListManager from '../../src/js/wwListManager';

describe('WysiwygEditor', () => {
  let $container, em, wwe;

  beforeEach(() => {
    $container = $('<div />');

    $('body').append($container);

    em = new EventManager();

    wwe = new WysiwygEditor($container, em);

    wwe.init();
    wwe.editor.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      $('body').empty();
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
        data: {keyCode: 0}
      });
      expect(handler).toHaveBeenCalled();
    });

    it('add key event with particular keymap and run', () => {
      const handler = jasmine.createSpy('keyEventHandler');
      wwe.addKeyEventHandler('HOME', handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: {keyCode: 0}
      });
      expect(handler).toHaveBeenCalled();
    });

    it('run particular keymap and default', () => {
      const handler = jasmine.createSpy('keyEventHandler');
      wwe.addKeyEventHandler('HOME', handler);
      wwe.addKeyEventHandler(handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: {keyCode: 0}
      });
      expect(handler.calls.count()).toEqual(2);
    });

    it('if handler returns false stop invoke next handler', () => {
      const handler = jasmine.createSpy('keyEventHandler');
      wwe.addKeyEventHandler('HOME', () => false);
      wwe.addKeyEventHandler('HOME', handler);
      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: {keyCode: 0}
      });
      expect(handler).not.toHaveBeenCalled();
    });

    it('if defalut handler returns false dont invoke keymap handler', () => {
      const handler = jasmine.createSpy('keyEventHandler');
      wwe.addKeyEventHandler(() => false);

      wwe.addKeyEventHandler('HOME', handler);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'HOME',
        data: {keyCode: 0}
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

      expect(wwe.get$Body().find('div').text()).toBe('\u00a0\u00a0\u00a0\u00a0');
    });

    it('should not insert 4 spaces when "TAB" pressed in list item', () => {
      const range = wwe.getEditor().getSelection();

      wwe.getEditor().setHTML('<ul><li><div><br></div></li></ul>');

      range.setStart(wwe.get$Body().find('li>div')[0], 0);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'TAB',
        data: {
          preventDefault: () => {}
        }
      });

      expect(wwe.get$Body().find('div').text()).toBe('');
    });

    it('should not insert 4 spaces when "TAB" pressed in task list', () => {
      const range = wwe.getEditor().getSelection();

      wwe.getEditor().setHTML('<ul><li class="task-list-item"><div><input type="checkbox"/><br></div></li></ul>');

      range.setStartAfter(wwe.get$Body().find('div>input')[0]);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      em.emit('wysiwygKeyEvent', {
        keyMap: 'TAB',
        data: {
          preventDefault: () => {}
        }
      });

      expect(wwe.get$Body().find('div').text()).toBe('');
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

    it('fire stateChange event when state changed', () => {
      em.listen('stateChange', data => {
        expect(data.bold).toBe(true);
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

    it('prevent text, image merge', () => {
      const html = '<p>test<br><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAAXklEQVQIHWM8OeXvfwaW/wx/fjMwsHMwMjD9BLH+MDIwMTIy/PnJwMDMI87aIMiswCDMx89w98UNBpZX/48zbLx7h0H/TTjDo18nGZjYWVkZOLm5GU587mb4wvCcAQACuB2BMklKxwAAAABJRU5ErkJggg==" alt="image"></p>';
      wwe.setValue(html);
      expect(wwe.get$Body().find('div').length).toEqual(3);
      expect(wwe.get$Body().find('div').eq(0).text()).toEqual('test');
      expect(wwe.get$Body().find('div').eq(1).find('img').length).toEqual(1);
    });

    it('record undo state after all setValue process not setHTML', done => {
      const html = '<ul><li>test</li></ul>';

      em.listen('wysiwygSetValueAfter', () => {
        wwe.get$Body().html('<h2>test<br></h2>');
      });

      wwe.setValue(html);

      setTimeout(() => {
        wwe.getEditor().insertHTML('<h1>test</h1>');
        setTimeout(() => {
          wwe.getEditor().undo();
          expect(wwe.get$Body().find('h1').length).toEqual(0);
          expect(wwe.get$Body().find('h2').length).toEqual(1);
          done();
        }, 0);
      }, 0);
    });

    it('move cursor to end after setValue() cuz we need new range after whole conntent changed', () => {
      wwe.setValue('<ul><li><div>test</div></li></ul><div>test2<br></div>');
      const range = wwe.getRange();

      expect(range.startContainer).toBe(wwe.get$Body().find('div')[1]);
      expect(range.startOffset).toEqual(1);
    });

    it('should not move cursor to end after setValue() if `cursorToEnd` param is set to false', () => {
      wwe.setValue('<ul><li><div>test</div></li></ul><div>test2<br></div>', false);
      const range = wwe.getRange();

      expect(range.startContainer).not.toBe(wwe.get$Body().find('div')[1]);
      expect(range.startOffset).not.toEqual(1);
    });
  });

  describe('insertText()', () => {
    let sqe,
      selection,
      $body;

    beforeEach(() => {
      sqe = wwe.getEditor();
      selection = sqe.getSelection().cloneRange();
      $body = sqe.get$Body();
    });

    it('to cursor position', () => {
      sqe.setHTML('<div>text  here<br/></div>');

      selection.setStart($body.find('div')[0].firstChild, 5);
      selection.collapse(true);
      sqe.setSelection(selection);

      wwe.insertText('insert');

      expect($body[0].textContent).toEqual('text insert here');
    });

    it('to selected area', () => {
      sqe.setHTML('<div>text here<br/></div>');

      selection.setStart($body.find('div')[0].firstChild, 5);
      selection.setEnd($body.find('div')[0].firstChild, 9);
      sqe.setSelection(selection);

      wwe.insertText('replaced');

      expect($body[0].textContent).toEqual('text replaced');
    });
  });

  it('get$Body() get current wysiwyg iframe body that wrapped jquery', () => {
    expect(wwe.get$Body().length).toEqual(1);
    expect(wwe.get$Body().prop('tagName')).toEqual('DIV');
    expect(wwe.get$Body().hasClass('tui-editor-contents')).toBe(true);
  });

  it('hasFormatWithRx() check hasFormat with RegExp', () => {
    wwe.setValue('<h1>hasHeading</h1>');
    expect(wwe.hasFormatWithRx(/h[\d]/i)[0]).toEqual('H1');
  });

  describe('_wrapDefaultBlockTo', () => {
    it('wrap selection defulat block', done => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.get$Body().html('abcdef');

      range.setStart(wwe.get$Body()[0].firstChild, 4);
      range.collapse(true);
      wwe._wrapDefaultBlockTo(range);

      expect(wwe.getEditor().getHTML().replace(/<br \/>|<br>/g, '')).toEqual('<div>abcdef</div>');
      done();
    });
  });

  describe('breakToNewDefaultBlock()', () => {
    it('make new defulatBlock then move selection to it', () => {
      wwe.get$Body().html('<div>aef<br></div>');

      const range = wwe.getEditor().getSelection().cloneRange();

      range.setStart(wwe.get$Body()[0], 0);
      range.collapse(true);
      wwe.breakToNewDefaultBlock(range);

      expect(wwe.getEditor().getHTML()).toEqual('<div>aef<br></div><div><br></div>');
      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
      expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
    });

    it('make new defulatBlock to body child then move selection to it', () => {
      wwe.get$Body().html('<h1><div>aef<br></div></h1>');

      const range = wwe.getEditor().getSelection().cloneRange();

      // select text node
      range.setStart(wwe.get$Body().find('div')[0], 0);
      range.collapse(true);
      wwe.breakToNewDefaultBlock(range);

      expect(wwe.getEditor().getHTML()).toEqual('<h1><div>aef<br></div></h1><div><br></div>');
      expect(wwe.getEditor().getSelection().startContainer.textContent).toEqual('');
      expect(wwe.getEditor().getSelection().startContainer.tagName).toEqual('DIV');
    });
  });

  describe('unwrapBlockTag()', () => {
    it('unwrap tag of current selection with tag name', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.get$Body().html('<h1><div>test<br></div></h1>');

      range.selectNode(wwe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      wwe.getEditor().setSelection(range);
      wwe.unwrapBlockTag('H1');

      expect(wwe.getValue().replace(/<br \/>/g, '')).toEqual('test');
    });

    it('unwrap tag of current selection with condition callback', () => {
      const range = wwe.getEditor().getSelection().cloneRange();

      wwe.get$Body().html('<h1><div>test<br></div></h1>');

      range.selectNode(wwe.get$Body().find('div')[0].firstChild);
      range.collapse(true);
      wwe.getEditor().setSelection(range);

      wwe.unwrapBlockTag(tagName => tagName === 'H1');

      expect(wwe.getValue().replace(/<br \/>/g, '')).toBe('test');
    });
  });

  describe('replace node\'s content text', () => {
    it('replace text without affect tags', () => {
      wwe.get$Body().html('<ul><li class="custom-class">list1</li><li>list2</li></ul>');

      wwe.replaceContentText(wwe.get$Body().find('li')[0], 'list1', 'list2');

      expect(wwe.getValue().replace(/<br \/>/g, ''))
        .toBe('<ul><li class="custom-class">list2</li><li>list2</li></ul>');
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
      wwe.setValue('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
      wwe.moveCursorToEnd();

      const range = wwe.getRange();

      expect(wwe.scrollTop()).not.toEqual(0);
      expect(range.startContainer).toEqual(wwe.get$Body()[0].lastChild);
      expect(range.startOffset).toEqual(1);
    });
    it('move cursor to start and scroll to top', () => {
      wwe.setValue('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
      wwe.moveCursorToEnd();
      wwe.moveCursorToStart();

      const range = wwe.getRange();

      expect(wwe.scrollTop()).toEqual(0);
      expect(range.startContainer).toEqual(wwe.get$Body().find('div')[0].firstChild);
      expect(range.startOffset).toEqual(0);
    });
  });

  it('scroll if needed on wysiwygRangeChangeAfter', () => {
    wwe.setHeight(30);
    wwe.setValue('a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>');
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

      wwe.$editorContainerEl.remove();
    });
  });

  describe('_getLastListString ', () => {
    it('should get last list string', () => {
      expect(wwe._getLastLiString('UL>LI>UL>LI>OL>LI>DIV')).toEqual('LI>DIV');
      expect(wwe._getLastLiString('UL>LI>UL>LI>OL>LI.te-task-list>DIV')).toEqual('LI.te-task-list>DIV');
    });
    it('should return empty string when Last LI not exists', () => {
      expect(wwe._getLastLiString('DIV')).toEqual('');
      expect(wwe._getLastLiString('BLOCKQUOTE>DIV')).toEqual('');
    });
  });
});
