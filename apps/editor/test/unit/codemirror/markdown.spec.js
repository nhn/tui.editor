/**
 * @fileoverview test markdown
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

import '@/codemirror/markdown';

describe('codemirror addon markdown', () => {
  let mde, em, container, toastMark;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    toastMark = new ToastMark();
    mde = new MarkdownEditor(container, em, toastMark);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should set different style according to it`s depth', () => {
    const list = '1. list1\n\t1. list2\n\t\t1. list3';
    const cm = mde.getEditor();

    cm.setValue(list);

    expect(cm.lineInfo(0).handle.styles).toContain('variable-2');
    expect(cm.lineInfo(1).handle.styles).toContain('variable-3');
    expect(cm.lineInfo(2).handle.styles).toContain('keyword');
  });

  it('should set same style according to it`s depth (issue #1002)', () => {
    const list = '1. list1\n\t10. list2\n\t2. list3';
    const cm = mde.getEditor();

    cm.setValue(list);

    expect(cm.lineInfo(0).handle.styles).toContain('variable-2');
    expect(cm.lineInfo(1).handle.styles).toContain('variable-3');
    expect(cm.lineInfo(2).handle.styles).toContain('variable-3');
  });
});
