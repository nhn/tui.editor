/**
 * @fileoverview test domUtils
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import domUtils from '../../src/js/domUtils.js';

describe('domUtils', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.parentNode.removeChild(container);
  });

  describe('getNodeName', () => {
    it('returns tagName if passed Node is ELEMENT_NODE', () => {
      expect(domUtils.getNodeName($('<div />')[0])).toEqual('DIV');
      expect(domUtils.getNodeName($('<BR />')[0])).toEqual('BR');
      expect(domUtils.getNodeName($('<H1 />')[0])).toEqual('H1');
    });

    it('returns "TEXT" if passed node is TEXT_NODE', () => {
      expect(domUtils.getNodeName($('<p>hi</p>')[0].firstChild)).toEqual('TEXT');
    });
  });

  describe('isTextNode', () => {
    it('return true if passed node is TEXT_NODE', () => {
      expect(domUtils.isTextNode($('<p>hi</p>')[0].firstChild)).toBe(true);
    });
    it('return false if passed node is not TEXT_NODE', () => {
      expect(domUtils.isTextNode($('<p>hi</p>')[0])).toBe(false);
    });
  });

  describe('isElemNode', () => {
    it('return true if passed node is ELEMENT_NODE', () => {
      expect(domUtils.isElemNode($('<p>hi</p>')[0])).toBe(true);
    });
    it('return false if passed node is not ELEMENT_NODE', () => {
      expect(domUtils.isElemNode($('<p>hi</p>')[0].firstChild)).toBe(false);
    });
  });

  describe('getTextLength', () => {
    it('returns node\'s text content length', () => {
      expect(domUtils.getTextLength($('<p>hi</p>')[0])).toBe(2);
      expect(domUtils.getTextLength($('<p>hi</p>')[0].firstChild)).toBe(2);
    });
  });

  describe('getOffsetLength', () => {
    it('return childNodes length if passed node is ELEMENT_NODE', () => {
      expect(domUtils.getOffsetLength($('<p>hi</p>')[0])).toBe(1);
    });
    it('return nodeValue length if passed node is TEXT_NODE', () => {
      expect(domUtils.getOffsetLength($('<p>hi</p>')[0].firstChild)).toBe(2);
    });
  });

  describe('getNodeOffsetOfParent', () => {
    it('get node offset from parent childs', () => {
      const ul = $('<ul><li>list1</li><li>list2</li></ul>');
      expect(domUtils.getNodeOffsetOfParent(ul.find('li')[1])).toBe(1);
    });
  });

  describe('getPrevNodeUntil()', () => {
    it('if node is text node and not first offset then return text node', () => {
      const node = $('<p>text</p>');
      expect(domUtils.getPrevOffsetNodeUntil(node[0].childNodes[0], 1)).toBe(node[0].childNodes[0]);
    });

    it('if node is text node and offset is first then return prev element', () => {
      const node = $('<div>textPrev</div><p>text</p>');
      expect(domUtils.getPrevOffsetNodeUntil(node[1].childNodes[0], 0)).toBe(node[0]);
    });

    it('if node is text node that have multiple parent node and offset is first then return prev element', () => {
      const node = $('<div>textPrev</div><p><span>text</span></p>');
      expect(domUtils.getPrevOffsetNodeUntil(node.find('span')[0].childNodes[0], 0)).toBe(node[0]);
    });

    it('find prev offset node from element node', () => {
      const node = $('<div>textPrev</div><p><em>text</em><span>text</span></p>');
      expect(domUtils.getPrevOffsetNodeUntil(node[1], 1)).toBe(node.find('em')[0]);
    });

    it('find prev offset node from element node at first offset', () => {
      const node = $('<div>textPrev</div><p><span>text</span></p>');
      expect(domUtils.getPrevOffsetNodeUntil(node[1], 0)).toBe(node[0]);
    });

    it('find prev node until nodename', () => {
      const node = $('<div>textPrev</div><p><span>text</span></p>');
      expect(domUtils.getPrevOffsetNodeUntil(node.find('span')[0].childNodes[0], 0, 'P')).toBeUndefined();
    });
  });

  describe('getChildNodeByOffset()', () => {
    it('return node\'s childNode with index', () => {
      const node = $('<p><em>text</em><strong>weafwae</strong></p>');
      expect(domUtils.getChildNodeByOffset(node[0], 1)).toBe(node[0].childNodes[1]);
    });

    it('if node is text node then return passed node', () => {
      const node = $('<p>text</p>');
      expect(domUtils.getChildNodeByOffset(node[0].childNodes[0], 1)).toBe(node[0].childNodes[0]);
    });
    it('returns childNodes at index', () => {
      container.innerHTML = '<ul><li>0</li><li>1</li></ul>';

      const result = domUtils.getChildNodeByOffset(container.childNodes[0], 1);

      expect(result).toBe(container.querySelectorAll('li')[1]);
    });

    it('returns undefined if theres no result', () => {
      container.innerHTML = '<ul><li>0</li><li>1</li></ul>';

      const result = domUtils.getChildNodeByOffset($('ul')[0], 2);

      expect(result).toBeUndefined();
    });

    it('returns undefined if there is no child', () => {
      container.innerHTML = '<ul></ul>';

      const result = domUtils.getChildNodeByOffset($('ul')[0], 2);

      expect(result).toBeUndefined();
    });

    it('returns childNodes if index >= 0', () => {
      container.innerHTML = '<ul><li>0</li><li>1</li></ul>';

      const result = domUtils.getChildNodeByOffset($('ul')[0], -1);

      expect(result).toBeUndefined();
    });
  });

  describe('getTopPrevNodeUnder ', () => {
    it('return previous block element of passed node', () => {
      container.innerHTML = '<div>text1</div><p>text2</p>';
      expect(domUtils.getTopPrevNodeUnder(container.querySelector('p').firstChild, container)).toBe(container.querySelector('div'));
    });
  });

  describe('getTopNextNodeUnder', () => {
    it('return next block element of passed node', () => {
      container.innerHTML = '<div><i>awef</i><em>text1</em></div><p>text2</p>';
      expect(domUtils.getTopNextNodeUnder($('em')[0].firstChild, container)).toBe($('p')[0]);
    });
  });

  describe('getTopBlockNode', () => {
    it('return top block element of passed node', () => {
      container.innerHTML = '<div><i>awef</i><em>text1</em></div><p>text2</p>';
      expect(domUtils.getTopBlockNode($('em')[0].firstChild)).toBe(container);
    });
  });

  describe('getParentUntil', () => {
    it('get parent until specific node that have given tag name', () => {
      container.innerHTML = '<div><p>awef<em>text1</em></p></div>';
      expect(domUtils.getParentUntil($('em')[0].firstChild, 'DIV')).toBe($('p')[0]);
    });

    it('get parent until specific node that have given tag name #2', () => {
      container.innerHTML = '<div><p>awef<em>text1</em></p></div>';
      expect(domUtils.getParentUntil($('em')[0].firstChild, 'P')).toBe($('EM')[0]);
    });

    it('get parent until specific node that same as given node', () => {
      container.innerHTML = '<div><p>awef<em>text1</em></p></div>';
      expect(domUtils.getParentUntil($('em')[0].firstChild, container.querySelector('div'))).toBe($('p')[0]);
    });
  });

  describe('getPrevTextNode', () => {
    it('get prev text node of given node #1', () => {
      container.innerHTML = '<div class="test"><div>text1<em>text2</em></div><div>text3</div></div>';
      expect(domUtils.getPrevTextNode($('.test div')[1].lastChild)).toBe($('.test em')[0].firstChild);
    });

    it('get prev text node of given node #2', () => {
      container.innerHTML = '<div class="test"><div>text1</div><div><br></div><div>text3</div></div>';
      expect(domUtils.getPrevTextNode($('.test div')[2].lastChild)).toBe($('.test div')[0].firstChild);
    });

    it('get prev text node of given node #3', () => {
      container.innerHTML = '<div class="test"><ul><li><em>text1</em></li></ul><div><p><br></p></div><div>text3</div></div>';
      expect(domUtils.getPrevTextNode($('.test div')[1].lastChild)).toBe($('.test em')[0].firstChild);
    });
  });

  describe('getPath', () => {
    it('get path of passed node', () => {
      const $dom = $('<div><ul><li><div><span>findme</span></div></li></ul></div>');
      const expected = [
        {
          tagName: 'UL'
        },
        {
          tagName: 'LI'
        },
        {
          tagName: 'DIV'
        },
        {
          tagName: 'SPAN'
        }
      ];

      expect(domUtils.getPath($dom.find('span')[0], $dom[0])).toEqual(expected);
    });

    it('get path of passed node with id and class information', () => {
      const $dom = $('<div><ul id="i1" class="c1"><li><div class="c2 c3"><span>findme</span></div></li></ul></div>');
      const expected = [
        {
          tagName: 'UL',
          id: 'i1',
          className: 'c1'
        },
        {
          tagName: 'LI'
        },
        {
          tagName: 'DIV',
          className: 'c2 c3'
        },
        {
          tagName: 'SPAN'
        }
      ];

      expect(domUtils.getPath($dom.find('span')[0], $dom[0])).toEqual(expected);
    });
  });
  describe('table traversal', () => {
    it('getTableCellByDirection should get next TH if exist', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getTableCellByDirection($dom.find('th')[0], 'next');
      const result2 = domUtils.getTableCellByDirection($dom.find('th')[1], 'next');
      expect(result.textContent).toBe('2');
      expect(result2).toBeNull();
    });

    it('getTableCellByDirection should get next TD if exist', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getTableCellByDirection($dom.find('td')[0], 'next');
      const result2 = domUtils.getTableCellByDirection($dom.find('td')[3], 'next');
      expect(result.textContent).toBe('4');
      expect(result2).toBeNull();
    });

    it('getSiblingRowCellByDirection should get next TD if exist at thead', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getSiblingRowCellByDirection($dom.find('th')[0], 'next');
      const result2 = domUtils.getSiblingRowCellByDirection($dom.find('th')[1], 'next');
      const result3 = domUtils.getSiblingRowCellByDirection($dom.find('th')[3], 'next');
      expect(result.textContent).toBe('3');
      expect(result2.textContent).toBe('4');
      expect(result3).toBeNull();
    });

    it('getSiblingRowCellByDirection should get next TD if exist at tbody', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getSiblingRowCellByDirection($dom.find('td')[0], 'next');
      const result2 = domUtils.getSiblingRowCellByDirection($dom.find('td')[1], 'next');
      const result3 = domUtils.getSiblingRowCellByDirection($dom.find('td')[3], 'next');
      expect(result.textContent).toBe('5');
      expect(result2.textContent).toBe('6');
      expect(result3).toBeNull();
    });
    it('getTableCellByDirection should get previous TH if exist', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getTableCellByDirection($dom.find('th')[0], 'previous');
      const result2 = domUtils.getTableCellByDirection($dom.find('th')[1], 'previous');
      expect(result).toBeNull();
      expect(result2.textContent).toBe('1');
    });

    it('getTableCellByDirection should get previous TD if exist', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getTableCellByDirection($dom.find('td')[0], 'previous');
      const result2 = domUtils.getTableCellByDirection($dom.find('td')[3], 'previous');
      expect(result).toBeNull();
      expect(result2.textContent).toBe('5');
    });

    it('getSiblingRowCellByDirection should get previous TD if exist at thead', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getSiblingRowCellByDirection($dom.find('th')[0], 'previous');
      const result2 = domUtils.getSiblingRowCellByDirection($dom.find('th')[1], 'previous');
      const result3 = domUtils.getSiblingRowCellByDirection($dom.find('td')[3], 'previous');
      expect(result).toBeNull();
      expect(result2).toBeNull();
      expect(result3.textContent).toBe('4');
    });

    it('getSiblingRowCellByDirection should get previous TD if exist at tbody', () => {
      const $dom = $('<table>' +
                '<thead><tr><th>1</th><th>2</th></tr></thead>' +
                '<tbody><tr><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td></tr></tbody>' +
                '</table>');
      const result = domUtils.getSiblingRowCellByDirection($dom.find('td')[0], 'previous');
      const result2 = domUtils.getSiblingRowCellByDirection($dom.find('td')[1], 'previous');
      const result3 = domUtils.getSiblingRowCellByDirection($dom.find('td')[3], 'previous');
      expect(result.textContent).toBe('1');
      expect(result2.textContent).toBe('2');
      expect(result3.textContent).toBe('4');
    });
  });
});
