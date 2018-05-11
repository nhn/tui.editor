/**
 * @fileoverview test fix ordered list number
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import MarkdownEditor from '../../../src/js/markdownEditor';
import EventManager from '../../../src/js/eventManager';

import '../../../src/js/codemirror/fixOrderedListNumber';

describe('fixOrderedListNumber', () => {
  let mde, em, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventManager();
    mde = new MarkdownEditor($(container), em);
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
