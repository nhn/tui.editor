/**
 * @fileoverview test wysiwyg clipboard manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import EventManager from '@/eventManager';
import WysiwygEditor from '@/wysiwygEditor';

describe('WwClipboardManager', () => {
  let container, wwe, cbm;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    cbm = wwe._clipboardManager;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('_extendRange', () => {
    beforeEach(() => {
      wwe.focus();
    });
    it('Extend start selection if whole content of startContainer are contained', () => {
      wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
      let range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('LI')[0].childNodes[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('LI')[1].childNodes[0], 3);

      cbm._extendRange(range);
      range = wwe.getEditor().getSelection();

      expect(range.startContainer.childNodes[range.startOffset].tagName).toEqual('LI');
      expect(range.startContainer.childNodes[range.startOffset].textContent).toEqual('list1');
      expect(range.endContainer.nodeType).toEqual(Node.TEXT_NODE);
      expect(range.endContainer.nodeValue[range.endOffset]).toEqual('t');
    });

    it('Extend end selection if whole content of endContainer are contained', () => {
      wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
      let range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('LI')[0].childNodes[0], 3);
      range.setEnd(wwe.getBody().querySelectorAll('LI')[1].childNodes[0], 5);

      cbm._extendRange(range);
      range = wwe.getEditor().getSelection();

      expect(range.startContainer.nodeType).toEqual(Node.TEXT_NODE);
      expect(range.startContainer.nodeValue[range.startOffset]).toEqual('t');
      expect(range.endContainer.childNodes[range.endOffset - 1].tagName).toEqual('LI');
      expect(range.endContainer.childNodes[range.endOffset - 1].textContent).toEqual('list2');
    });

    it('if selection area is whole content of commonAncestorContainer then select commonAncestorContainer', () => {
      wwe.getEditor().setHTML('<ul><li>list1</li><li>list2</li></ul>');
      let range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('LI')[0].childNodes[0], 0);
      range.setEnd(wwe.getBody().querySelectorAll('LI')[1].childNodes[0], 5);

      cbm._extendRange(range);
      range = wwe.getEditor().getSelection();

      expect(range.startContainer.childNodes[range.startOffset].tagName).toEqual('UL');
      expect(range.endContainer.childNodes[range.endOffset - 1].tagName).toEqual('UL');
    });

    it('if selection area is whole text content of one element then extend to commonAncestorContainer', () => {
      wwe.getEditor().setHTML('<h1>hello world<br></h1>');
      let range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('h1')[0].firstChild, 0);
      range.setEnd(wwe.getBody().querySelectorAll('h1')[0].firstChild, 11);

      cbm._extendRange(range);
      range = wwe.getEditor().getSelection();

      expect(range.startContainer).toBe(wwe.getBody());
      expect(range.startOffset).toEqual(0);
      expect(range.endContainer).toBe(wwe.getBody());
      expect(range.endOffset).toEqual(1);
    });

    it('if partial text selected of one text node then dont do anything', () => {
      wwe.getEditor().setHTML('<h1>hello world<br></h1>');
      let range = wwe
        .getEditor()
        .getSelection()
        .cloneRange();

      range.setStart(wwe.getBody().querySelectorAll('h1')[0].firstChild, 5);
      range.setEnd(wwe.getBody().querySelectorAll('h1')[0].firstChild, 11);
      wwe.getEditor().setSelection(range);

      cbm._extendRange(range);
      range = wwe.getEditor().getSelection();

      expect(range.startContainer).toBe(range.endContainer);
      expect(range.startContainer.className).toBe();
      expect(range.startContainer.nodeType === Node.TEXT_NODE).toBe(true);
      expect(range.endContainer.nodeType === Node.TEXT_NODE).toBe(true);
    });
  });
});
