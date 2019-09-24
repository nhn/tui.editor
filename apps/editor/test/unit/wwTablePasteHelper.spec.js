/**
 * @fileoverview test wysiwyg table paste helper
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import WwTablePasteHelper from '@/wwTablePasteHelper';

function createElement(tag, textContent) {
  const element = document.createElement(tag);
  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

describe('WwTablePasteHelper', () => {
  let tph;

  beforeEach(() => {
    tph = new WwTablePasteHelper();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Prepare paste fragment from clipboard data', () => {
    it('_unwrapBlock should return document fragment that has only inline node', () => {
      const node = document.createElement('div');
      node.appendChild(createElement('div', 'aaa'));
      node.appendChild(createElement('div', 'bbb'));

      const result = tph._unwrapBlock(node);

      expect(result.childNodes.length).toBe(3);
      expect(result.childNodes[1].nodeName).toBe('BR');
    });
  });

  describe('Remove contents of range when range is not collapsed', () => {
    describe('_deleteContentsByOffset', () => {
      it('Remove nodes from start offset to end offset when container is text node', () => {
        const textNode = document.createTextNode('123456789');

        tph._deleteContentsByOffset(textNode, 3, 6);

        expect(textNode.textContent).toBe('123789');
      });

      it('Remove nodes from start offset to end offset when container is not text node', () => {
        const node = document.createElement('td');
        node.appendChild(createElement('div', 'aaa'));
        node.appendChild(createElement('div', 'bbb'));
        node.appendChild(createElement('div', 'ccc'));

        tph._deleteContentsByOffset(node, 1, 2);

        const expectedHtml = '<div>aaa</div><div>ccc</div>';

        expect(node.innerHTML).toBe(expectedHtml);
      });
    });

    describe('_deleteContentsRange', () => {
      it('Remove nodes in range when startContainer and endContianer is td', () => {
        const target = document.createElement('td');
        target.innerHTML = '111<b>222</b>333<i>444</i>555';
        document.body.appendChild(target);

        const range = document.createRange();
        range.setStart(document.querySelector('td'), 1);
        range.setEnd(document.querySelector('td'), 3);

        tph._deleteContentsRange(range);

        const expectedHtml = '111<i>444</i>555';

        expect(target.innerHTML).toBe(expectedHtml);
      });

      it('Remove nodes in range when startContainer is not same endContainer', () => {
        const target = document.createElement('td');
        target.innerHTML = '111<b>222<s>333</s></b>444<i>555</i>';
        document.body.appendChild(target);

        const range = document.createRange();
        range.setStart(document.querySelector('b'), 1);
        range.setEnd(document.querySelector('i'), 0);

        tph._deleteContentsRange(range);

        const expectedHtml = '111<b>222</b><i>555</i>';

        expect(target.innerHTML).toBe(expectedHtml);
      });

      it('Remove nodes in range when startContainer is not same endContainer and those are text nodes', () => {
        const target = document.createElement('td');
        target.innerHTML = '111<b>222</b>333<i>444</i>555';
        document.body.appendChild(target);

        const range = document.createRange();
        range.setStart(document.querySelector('b').firstChild, 1);
        range.setEnd(document.querySelector('i').firstChild, 1);

        tph._deleteContentsRange(range);

        const expectedHtml = '111<b>2</b><i>44</i>555';

        expect(target.innerHTML).toBe(expectedHtml);
      });
    });
  });
});
