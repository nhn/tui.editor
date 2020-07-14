/**
 * @fileoverview test markdown editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
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

  describe('task', () => {
    let setValue, setCursor, setSelection, getValue;
    let changeTextToTaskMarker, toggleTaskStates;

    function init() {
      const doc = mde.getEditor().getDoc();

      setValue = val => mde.setValue(val);
      setCursor = pos => doc.setCursor(pos);
      setSelection = (from, to) => doc.setSelection(from, to);
      getValue = () => mde.getValue();
      toggleTaskStates = () => mde._toggleTaskStates();
      changeTextToTaskMarker = () => mde._changeTextToTaskMarker();
    }

    beforeEach(() => {
      init();
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
      let list;

      beforeEach(() => {
        list = '1. [ ] list1\n\t* [ ] list2\n\t\t* [x] list3';
      });

      it('when all from start line to last line is selected', () => {
        setValue(list);
        setSelection({ line: 0, ch: 0 }, { line: 2, ch: 19 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [ ] list3');
      });

      it('when text of start line to text of last line is selected', () => {
        setValue(list);
        setSelection({ line: 1, ch: 11 }, { line: 2, ch: 15 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [ ] list1\n\t* [x] list2\n\t\t* [ ] list3');
      });

      it('when marker of start line to list of last line is selected', () => {
        setValue(list);
        setSelection({ line: 0, ch: 4 }, { line: 1, ch: 0 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [x] list3');
      });

      it('when selecting from bottom cursor to top cursor', () => {
        setValue(list);
        setSelection({ line: 1, ch: 0 }, { line: 0, ch: 4 });
        toggleTaskStates();

        expect(getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [x] list3');
      });
    });
  });
});
