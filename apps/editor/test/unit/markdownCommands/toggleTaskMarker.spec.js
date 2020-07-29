/**
 * @fileoverview test ToggleTaskMarker command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { source } from 'common-tags';

import { ToastMark } from '@toast-ui/toastmark';
import toggleTaskMarker from '@/markdownCommands/toggleTaskMarker';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';
import mdListManager from '@/mdListManager';

describe('ToggleTaskMarker command', () => {
  let cm, doc, mde, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    mde = new MarkdownEditor(container, new EventManager(), new ToastMark());
    mde.componentManager.addManager(mdListManager);

    cm = mde.getEditor();
    doc = cm.getDoc();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('toggle task state according to cursor position', () => {
    const sourceText = source`
      1. [ ] list1
        * [x] **list2**
    `;

    cm.setValue(sourceText);

    cm.setCursor({ line: 1, ch: 0 }); // in list node
    toggleTaskMarker.exec(mde);

    let expected = source`
      1. [ ] list1
        * [ ] **list2**
    `;

    expect(cm.getValue()).toBe(expected);

    cm.setCursor({ line: 0, ch: 3 }); // in item node
    toggleTaskMarker.exec(mde);

    expected = source`
      1. [x] list1
        * [ ] **list2**
    `;
    expect(cm.getValue()).toBe(expected);

    cm.setCursor({ line: 1, ch: 5 }); // in marker syntax
    toggleTaskMarker.exec(mde);

    expected = source`
      1. [x] list1
        * [x] **list2**
    `;
    expect(cm.getValue()).toBe(expected);

    cm.setCursor({ line: 0, ch: 10 }); // in text node
    toggleTaskMarker.exec(mde);

    expected = source`
      1. [ ] list1
        * [x] **list2**
    `;
    expect(cm.getValue()).toBe(expected);
  });

  describe('toggle task state according to selection', () => {
    beforeEach(() => {
      const sourceText = source`
        1. [ ] list1
          * [ ] list2
            * [x] list3
      `;

      cm.setValue(sourceText);
    });

    it('when all from start line to last line is selected', () => {
      doc.setSelection({ line: 0, ch: 0 }, { line: 2, ch: 19 });

      toggleTaskMarker.exec(mde);

      const expected = source`
        1. [x] list1
          * [x] list2
            * [ ] list3
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('when text of start line to text of last line is selected', () => {
      doc.setSelection({ line: 1, ch: 11 }, { line: 2, ch: 15 });

      toggleTaskMarker.exec(mde);

      const expected = source`
        1. [ ] list1
          * [x] list2
            * [ ] list3
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('when marker of start line to list of last line is selected', () => {
      doc.setSelection({ line: 0, ch: 4 }, { line: 1, ch: 0 });

      toggleTaskMarker.exec(mde);

      const expected = source`
        1. [x] list1
          * [x] list2
            * [x] list3
      `;

      expect(cm.getValue()).toBe(expected);
    });

    it('when selecting from bottom cursor to top cursor', () => {
      doc.setSelection({ line: 1, ch: 0 }, { line: 0, ch: 4 });

      toggleTaskMarker.exec(mde);

      const expected = source`
        1. [x] list1
          * [x] list2
            * [x] list3
      `;

      expect(cm.getValue()).toBe(expected);
    });
  });
});
