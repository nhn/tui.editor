/**
 * @fileoverview test fix ordered list number
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { ToastMark } from '@toast-ui/toastmark';
import MarkdownEditor from '@/markdownEditor';
import EventManager from '@/eventManager';

import '@/codemirror/fixOrderedListNumber';

describe('fixOrderedListNumber', () => {
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

  it('should fix nested list item to start from 1', () => {
    const list = '1. list1\n\t2. list2';
    const cm = mde.getEditor();

    cm.setValue(list);
    cm.setCursor({
      line: 1,
      ch: 0
    });

    cm.execCommand('fixOrderedListNumber');
    expect(mde.getValue()).toBe('1. list1\n\t1. list2');
  });

  it('should fix peer list item number to be continued', () => {
    const list = '1. list1\n\t2. list2\n1. list3';
    const cm = mde.getEditor();

    cm.setValue(list);
    cm.setCursor({
      line: 1,
      ch: 0
    });

    cm.execCommand('fixOrderedListNumber');
    expect(mde.getValue()).toBe('1. list1\n\t1. list2\n2. list3');
  });

  it('should fix nested peer list item number to be continued', () => {
    const list = '1. list1\n\t2. list2\n\t1. list3';
    const cm = mde.getEditor();

    cm.setValue(list);
    cm.setCursor({
      line: 1,
      ch: 0
    });

    cm.execCommand('fixOrderedListNumber');
    expect(mde.getValue()).toBe('1. list1\n\t1. list2\n\t2. list3');
  });
});
