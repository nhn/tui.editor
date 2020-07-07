/**
 * @fileoverview test tasklist in codemirror
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';
import { toggleTaskStates, changeTextToTaskMarker } from '@/codemirror/tasklist';

describe('tasklist in codemirror', () => {
  let mde, em, container, toastMark, cm;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    toastMark = new ToastMark();
    mde = new MarkdownEditor(container, em, toastMark);
    cm = mde.getEditor();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('toggle task state according to cursor position in', () => {
    let list;

    beforeEach(() => {
      list = '1. [ ] list1\n\t* [x] list2';
    });

    it('list', () => {
      cm.setValue(list);
      cm.setCursor({ line: 1, ch: 0 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [ ] list1\n\t* [ ] list2');
    });

    it('item', () => {
      cm.setValue(list);
      cm.setCursor({ line: 0, ch: 3 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [x] list1\n\t* [x] list2');
    });

    it('meta', () => {
      cm.setValue(list);
      cm.setCursor({ line: 0, ch: 5 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [x] list1\n\t* [x] list2');
    });

    it('text', () => {
      cm.setValue(list);
      cm.setCursor({ line: 0, ch: 10 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [x] list1\n\t* [x] list2');
    });

    it('text with inline style', () => {
      cm.setValue('1. [x] li **st** 1');
      cm.setCursor({ line: 0, ch: 13 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [ ] li **st** 1');
    });
  });

  describe('toggle task state according to selection', () => {
    let list;

    beforeEach(() => {
      list = '1. [ ] list1\n\t* [ ] list2\n\t\t* [x] list3';
    });

    it('when all from start line to last line is selected', () => {
      cm.setValue(list);
      cm.setSelection({ line: 0, ch: 0 }, { line: 2, ch: 19 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [ ] list3');
    });

    it('when text of start line to text of last line is selected', () => {
      cm.setValue(list);
      cm.setSelection({ line: 1, ch: 11 }, { line: 2, ch: 15 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [ ] list1\n\t* [x] list2\n\t\t* [ ] list3');
    });

    it('when marker of start line to list of last line is selected', () => {
      cm.setValue(list);
      cm.setSelection({ line: 0, ch: 4 }, { line: 1, ch: 0 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('1. [x] list1\n\t* [x] list2\n\t\t* [x] list3');
    });
  });

  describe('not toggle task state when task marker syntax is broken with', () => {
    it('cursor', () => {
      cm.setValue('* [    ] list');
      cm.setCursor({ line: 0, ch: 12 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('* [    ] list');
    });

    it('selection', () => {
      cm.setValue('* [    ] list1\n\t* [x  ] list2');
      cm.setSelection({ line: 0, ch: 4 }, { line: 1, ch: 2 });

      toggleTaskStates(cm, toastMark);

      expect(mde.getValue()).toBe('* [    ] list1\n\t* [x  ] list2');
    });
  });

  describe('when cursor is in task marker syntax', () => {
    it('spaces before state character are removed', () => {
      cm.setValue('* [  x] list');
      cm.setCursor({ line: 0, ch: 3 });

      changeTextToTaskMarker(cm, toastMark);

      expect(mde.getValue()).toBe('* [x] list');
    });

    it('spaces after state character are removed', () => {
      cm.setValue('* [x  ] list');
      cm.setCursor({ line: 0, ch: 5 });

      changeTextToTaskMarker(cm, toastMark);

      expect(mde.getValue()).toBe('* [x] list');
    });

    it('all spaces are removed', () => {
      cm.setValue('* [    x  ] list');
      cm.setCursor({ line: 0, ch: 3 });

      changeTextToTaskMarker(cm, toastMark);

      expect(mde.getValue()).toBe('* [x] list');
    });

    it('space is added if no spaces', () => {
      cm.setValue('* [] list');
      cm.setCursor({ line: 0, ch: 3 });

      changeTextToTaskMarker(cm, toastMark);

      expect(mde.getValue()).toBe('* [ ] list');
    });
  });
});
