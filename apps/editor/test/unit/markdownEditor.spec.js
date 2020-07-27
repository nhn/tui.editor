/**
 * @fileoverview test markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source } from 'common-tags';
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

describe('MarkdownEditor', () => {
  let mde, em, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    mde = new MarkdownEditor(container, em, new ToastMark());
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('when something change emit contentChangedFromMarkdown event', done => {
    em.listen('contentChangedFromMarkdown', changed => {
      changed.forEach(({ nodes, removedNodeRange }) => {
        const expectedMdNode = mde.getToastMark().findFirstNodeAtLine(1);

        expect(nodes[0]).toEqual(expectedMdNode);
        expect(removedNodeRange).toBeNull();
        done();
      });
    });

    mde.getEditor().replaceSelection('myText');
  });

  it('when something change emit changeFromMarkdown event', done => {
    em.listen('changeFromMarkdown', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.getEditor().replaceSelection('my');
  });

  it('when something change emit change event', done => {
    em.listen('change', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.getEditor().replaceSelection('comment');
  });

  it('when editor gain focus, emit focus event', done => {
    em.listen('focus', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
  });

  it('when editor lost focus, emit blur event', done => {
    em.listen('blur', ev => {
      expect(ev.source).toEqual('markdown');

      done();
    });

    mde.focus();
    mde.blur();
  });

  let doc, setValue, getValue, setCursor;

  function init() {
    doc = mde.getEditor().getDoc();

    setValue = val => mde.setValue(val);
    getValue = () => mde.getValue();
    setCursor = pos => doc.setCursor(pos);
  }

  describe('task', () => {
    let setSelection, changeTextToTaskMarker, toggleTaskStates;

    beforeEach(() => {
      init();

      setSelection = (from, to) => doc.setSelection(from, to);
      toggleTaskStates = () => mde._toggleTaskStates();
      changeTextToTaskMarker = () => mde._changeTextToTaskMarker();
    });

    describe('changeTextToTaskMarker()', () => {
      it('spaces before state character in marker are removed', () => {
        setValue('* [  x] list');
        setCursor({ line: 0, ch: 3 });
        changeTextToTaskMarker();

        expect(getValue()).toBe('* [x] list');
      });

      it('spaces after state character in marker are removed', () => {
        setValue('* [x  ] list');
        setCursor({ line: 0, ch: 5 });
        changeTextToTaskMarker();

        expect(getValue()).toBe('* [x] list');
      });

      it('all spaces in marker are removed', () => {
        setValue('* [    x  ] list');
        setCursor({ line: 0, ch: 3 });
        changeTextToTaskMarker();

        expect(getValue()).toBe('* [x] list');
      });

      it('space is added if marker has no spaces', () => {
        setValue('* [] list');
        setCursor({ line: 0, ch: 3 });
        changeTextToTaskMarker();

        expect(getValue()).toBe('* [ ] list');
      });
    });

    it('toggle task state according to cursor position', () => {
      setValue('1. [ ] list1\n\t* [x] list2');

      setCursor({ line: 1, ch: 0 }); // in list node
      toggleTaskStates();

      expect(getValue()).toBe('1. [ ] list1\n\t* [ ] list2');

      setCursor({ line: 0, ch: 3 }); // in item node
      toggleTaskStates();

      expect(getValue()).toBe('1. [x] list1\n\t* [ ] list2');

      setCursor({ line: 1, ch: 5 }); // in marker syntax
      toggleTaskStates();

      expect(getValue()).toBe('1. [x] list1\n\t* [x] list2');

      setCursor({ line: 0, ch: 10 }); // in text node
      toggleTaskStates();

      expect(getValue()).toBe('1. [ ] list1\n\t* [x] list2');

      setValue('1. [x] li **st** 1'); // in text node with inline style
      setCursor({ line: 0, ch: 13 });
      toggleTaskStates();

      expect(getValue()).toBe('1. [ ] li **st** 1');
    });

    describe('toggle task state according to selection', () => {
      beforeEach(() => {
        setValue('1. [ ] list1\n\t* [ ] list2\n\t\t* [x] list3');
      });

      it('when all from start line to last line is selected', () => {
        setSelection({ line: 0, ch: 0 }, { line: 2, ch: 19 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [ ] list3');
      });

      it('when text of start line to text of last line is selected', () => {
        setSelection({ line: 1, ch: 11 }, { line: 2, ch: 15 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [ ] list1\n\t* [x] list2\n\t\t* [ ] list3');
      });

      it('when marker of start line to list of last line is selected', () => {
        setSelection({ line: 0, ch: 4 }, { line: 1, ch: 0 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [x] list3');
      });

      it('when selecting from bottom cursor to top cursor', () => {
        setSelection({ line: 1, ch: 0 }, { line: 0, ch: 4 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [x] list3');
      });
    });
  });

  describe('table', () => {
    let getCursor;
    let onPressTabKey, onPressShiftTabKey, onPressEnterKey;

    beforeEach(() => {
      init();

      getCursor = () => doc.getCursor();
      onPressTabKey = () => mde._onPressTabKey();
      onPressShiftTabKey = () => mde._onPressShiftTabKey();
      onPressEnterKey = () => mde._onPressEnterKey();

      const table = source`
        | head | head |
        | --- | --- |
        | body | body |
      `;

      setValue(table);
    });

    describe('_onPressTabKey() move cursor', () => {
      it('to next cell', () => {
        setCursor({ line: 0, ch: 1 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 0, ch: 13 });

        setCursor({ line: 1, ch: 3 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 1, ch: 11 });

        setCursor({ line: 2, ch: 6 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 2, ch: 13 });
      });

      it('from last cell to first cell of next row', () => {
        setCursor({ line: 0, ch: 8 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 1, ch: 5 });

        setCursor({ line: 1, ch: 9 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 2, ch: 6 });
      });

      it('from last cell of last row to end of table', () => {
        setCursor({ line: 2, ch: 8 });
        onPressTabKey();
        expect(getCursor()).toEqual({ line: 2, ch: 15 });
      });
    });

    describe('_onPressShiftTabKey() move cursor', () => {
      it('to previous cell', () => {
        setCursor({ line: 0, ch: 9 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 0, ch: 6 });

        setCursor({ line: 1, ch: 8 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 1, ch: 5 });

        setCursor({ line: 2, ch: 13 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 2, ch: 6 });
      });

      it('from first cell to last cell of previous row', () => {
        setCursor({ line: 1, ch: 3 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 0, ch: 13 });

        setCursor({ line: 2, ch: 1 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 1, ch: 11 });
      });

      it('from first cell of row in thead to first of table', () => {
        setCursor({ line: 0, ch: 3 });
        onPressShiftTabKey();
        expect(getCursor()).toEqual({ line: 0, ch: 0 });
      });
    });

    describe('_onPressEnterKey()', () => {
      it('add newline when cursor is in cell of thead', () => {
        setCursor({ line: 0, ch: 3 });
        onPressEnterKey();

        const expected = source`
          | h
          ead | head |
          | --- | --- |
          | body | body |
        `;

        expect(getValue()).toBe(expected);
      });

      it('add new row when cursor is in cell of delimiter row', () => {
        setCursor({ line: 1, ch: 3 });
        onPressEnterKey();

        const expected = source`
          | head | head |
          | --- | --- |
          |  |  |
          | body | body |
        `;

        expect(getValue()).toBe(expected);
      });

      it('add new row when cursor is in cell of last row', () => {
        setCursor({ line: 2, ch: 13 });
        onPressEnterKey();

        const expected = source`
          | head | head |
          | --- | --- |
          | body | body |
          |  |  |
        `;

        expect(getValue()).toBe(expected);
      });

      it('remove last row when all cells of last row are empty', () => {
        setCursor({ line: 2, ch: 13 });
        onPressEnterKey();
        onPressEnterKey();

        const expected = source`
          | head | head |
          | --- | --- |
          | body | body |
        `;

        expect(getValue()).toBe(`${expected}\n`);
      });
    });
  });
});
