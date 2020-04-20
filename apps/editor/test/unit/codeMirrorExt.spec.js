/**
 * @fileoverview test codemirror extension
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import CodeMirrorExt from '@/codeMirrorExt';

describe('CodeMirrorExt', () => {
  let codeMirrorExt, container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('src/css/editor.css');
    loadStyleFixtures('node_modules/codemirror/lib/codemirror.css');

    container = document.createElement('div');
    document.body.appendChild(container);

    codeMirrorExt = new CodeMirrorExt(container);
  });

  afterEach(() => {
    container.parentNode.removeChild(container);
  });

  describe('Initialize', () => {
    it('make codemirror context', () => {
      expect($('.CodeMirror').length).toEqual(1);
    });
  });

  describe('replaceSelection', () => {
    it('replace selection content with passed content', () => {
      const selection = {
        from: {
          line: 0,
          ch: 0
        },
        to: {
          line: 0,
          ch: 0
        }
      };

      codeMirrorExt.replaceSelection('test', selection);

      expect(codeMirrorExt.getValue()).toEqual('test');
    });

    it('if replace selection without selection, use current selection', () => {
      codeMirrorExt.replaceSelection('test');
      expect(codeMirrorExt.getValue()).toEqual('test');
    });

    it("replace with current cursor's containers offset", () => {
      codeMirrorExt.replaceSelection('t');
      codeMirrorExt.replaceSelection('e');
      codeMirrorExt.replaceSelection('s');
      codeMirrorExt.replaceSelection('t');

      codeMirrorExt.replaceRelativeOffset('123', -2, 1);
      expect(codeMirrorExt.getValue()).toEqual('te123t');
    });
  });

  describe('move cursor to end or start', () => {
    it('move cursor to end', () => {
      codeMirrorExt.setValue('test\ntest\ntest\n');

      codeMirrorExt.moveCursorToEnd();

      expect(codeMirrorExt.getEditor().getCursor().line).toEqual(3);
      expect(codeMirrorExt.getEditor().getCursor().ch).toEqual(0);
    });

    it('move cursor to start', () => {
      codeMirrorExt.setValue('test\ntest\ntest\n');

      codeMirrorExt.moveCursorToStart();

      expect(codeMirrorExt.getEditor().getCursor().line).toEqual(0);
      expect(codeMirrorExt.getEditor().getCursor().ch).toEqual(0);
    });
  });

  describe('setValue', () => {
    it('move cursor to end after setValue', () => {
      codeMirrorExt.setValue('test\ntest\ntest\n');

      expect(codeMirrorExt.getEditor().getCursor().line).toEqual(3);
      expect(codeMirrorExt.getEditor().getCursor().ch).toEqual(0);
    });

    it('should not move cursor to end after setValue if false to `cursorToEnd` param', () => {
      codeMirrorExt.setValue('test\ntest\ntest\n', false);

      expect(codeMirrorExt.getEditor().getCursor().line).not.toEqual(3);
    });
  });

  it('getRange() returns current selection range', () => {
    const start = codeMirrorExt.getEditor().getCursor('from');
    const end = codeMirrorExt.getEditor().getCursor('to');
    const range = codeMirrorExt.getRange();

    expect(range.start).toBeDefined();
    expect(range.start.line).toEqual(start.line);
    expect(range.start.ch).toEqual(start.ch);
    expect(range.end).toBeDefined();
    expect(range.end.line).toEqual(end.line);
    expect(range.end.ch).toEqual(end.ch);
  });

  it('getCursor() returns current cursor', () => {
    const cursor = codeMirrorExt.getCursor();

    expect(cursor.line).toEqual(jasmine.any(Number));
    expect(cursor.ch).toEqual(jasmine.any(Number));
  });

  it('getWrapperElement() returns wrapper element', () => {
    const wrapper = codeMirrorExt.getWrapperElement();

    expect(wrapper).toEqual(jasmine.any(HTMLElement));
    expect($(wrapper.classList).hasClass('CodeMirror'));
  });

  describe('get, set scrollTop', () => {
    it('get scrollTop', done => {
      codeMirrorExt.setHeight(50);
      codeMirrorExt.setValue('1\n2\n3\n4\n5\n1\n2\n3\n4\n5\n');
      codeMirrorExt.scrollTop(10);

      setTimeout(() => {
        expect(codeMirrorExt.scrollTop()).not.toEqual(0);
        done();
      }, 500);
    });
  });

  describe('event', () => {
    it('on() add event handler for codemirror', () => {
      const handler = jasmine.createSpy('handler');

      codeMirrorExt.on('change', handler);
      codeMirrorExt.setValue('changed');

      expect(handler).toHaveBeenCalled();
    });

    it('off() remove event handler for codemirror', () => {
      const handler = jasmine.createSpy('handler');

      codeMirrorExt.on('change', handler);
      codeMirrorExt.setValue('changed');

      expect(handler.calls.count()).toEqual(1);

      codeMirrorExt.off('change', handler);
      codeMirrorExt.setValue('changed again');

      expect(handler.calls.count()).toEqual(1);
    });
  });
});
