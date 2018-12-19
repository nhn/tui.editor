/**
 * @fileoverview test wysiwyg table paste helper
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import WysiwygEditor from '../../src/js/wysiwygEditor';
import EventManager from '../../src/js/eventManager';
import WwTableManager from '../../src/js/wwTableManager';
import WwTablePasteHelper from '../../src/js/wwTablePasteHelper';

describe('WwTablePasteHelper', () => {
  let wwe, tph;

  beforeEach(() => {
    const $container = $('<div />');
    $('body').append($container);
    wwe = new WysiwygEditor($container, new EventManager());
    wwe.init();
    wwe.getEditor().focus();
    wwe.componentManager.addManager(WwTableManager);
    tph = new WwTablePasteHelper(wwe);
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('Paste container that has clipboard data', () => {
    it('_unwrapBlock should return document fragment that has only inline node', () => {
      const $node = $('<div><div>aaa</div><div>bbb</div></div>');
      const result = tph._unwrapBlock($node.get(0));
      expect(result.childNodes.length).toBe(5);
      expect(result.childNodes[1].nodeName).toBe('BR');
    });

    describe('_deleteContentsOffset', () => {
      it('Remove nodes from start offset to end offset when container is text node', () => {
        const textNode = document.createTextNode('123456789');
        tph._deleteContentsOffset(textNode, 3, 6);
        expect(textNode.textContent).toBe('123789');
      });

      it('Remove nodes from start offset to end offset when container is not text node', () => {
        const $node = $('<td><div>aaa</div><div>bbb</div><div>ccc</div></td>');
        tph._deleteContentsOffset($node.get(0), 1, 2);
        const expectedHtml = '<div>aaa</div><div>ccc</div>';
        expect($node.html()).toBe(expectedHtml);
      });
    });

    describe('_removeChild', () => {
      it('Remove nodes from node that is "from" parameter to node that is "to" parameter', () => {
        const $targetParent = $(`<b>aaa<i>bbb</i><s>ccc</s><span>ddd</span>eee</b>`);
        const $from = $targetParent.children('i');
        const $to = $targetParent.children('span');
        tph._removeChild($targetParent.get(0), $from.get(0), $to.get(0));
        const expectedHtml = 'aaa<span>ddd</span>eee';
        expect($targetParent.html()).toBe(expectedHtml);
      });

      it('Remove nodes from node that is "from" parameter to end fo child node', () => {
        const $targetParent = $(`<b>aaa<i>bbb</i><s>ccc</s><span>ddd</span>eee</b>`);
        const $from = $targetParent.children('i');
        tph._removeChild($targetParent.get(0), $from.get(0), null);
        const expectedHtml = 'aaa';
        expect($targetParent.html()).toBe(expectedHtml);
      });
    });

    describe('_removeNodesByDirection', () => {
      it('Remove forward nodes from the node to reach targetParent node', () => {
        const $targetParent = $(`<b>aaa<i>bbb<s>ccc</s>ddd</i>eee</b>`);
        const $startNode = $targetParent.children('i').children('s');
        tph._removeNodesByDirection($targetParent.get(0), $startNode.get(0), true);
        const expectedHtml = '<i><s>ccc</s>ddd</i>eee';
        expect($targetParent.html()).toBe(expectedHtml);
      });

      it('Remove backward nodes from the node to reach targetParent node', () => {
        const $targetParent = $(`<b>aaa<i>bbb<s>ccc</s>ddd</i>eee</b>`);
        const $startNode = $targetParent.children('i').children('s');
        tph._removeNodesByDirection($targetParent.get(0), $startNode.get(0), false);
        const expectedHtml = 'aaa<i>bbb<s>ccc</s></i>';
        expect($targetParent.html()).toBe(expectedHtml);
      });
    });
  });
});
