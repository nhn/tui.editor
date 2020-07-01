import DomRunner from '@/domRunner';
import toDom from '@/toDom';

describe('domRunner', () => {
  let domRunner;

  describe('get nodes text', () => {
    beforeEach(() => {
      const htmlStr = ['<h1>Hello World!</h1>'].join('');

      domRunner = new DomRunner(toDom(htmlStr));
    });

    it('get elements text', () => {
      domRunner.next();

      const text = domRunner.getNodeText();

      expect(text).toEqual('Hello World!');
    });

    it('get text nodes text', () => {
      domRunner.next();
      domRunner.next();

      const text = domRunner.getNodeText();

      expect(text).toEqual('Hello World!');
    });
  });

  describe('iterate Nodes 1depth', () => {
    beforeEach(() => {
      const htmlStr = ['<h1>Hello World!</h1>', '<p>paragraph </p>'].join('');

      domRunner = new DomRunner(toDom(htmlStr));
    });

    it('first node is h1', () => {
      const node = domRunner.next();

      expect(node.tagName).toEqual('H1');
      expect(domRunner.getNodeText()).toEqual('Hello World!');
    });

    it('second node is text node', () => {
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(domRunner.getNodeText()).toEqual('Hello World!');
    });

    it('third node is tag p', () => {
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('P');
    });

    it('fourth node is text node', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual('paragraph ');
    });
  });

  describe('iterate Nodes 2Depth with inline', () => {
    beforeEach(() => {
      const htmlStr = ['<p>make me <strong>bold</strong></p>'].join('');

      domRunner = new DomRunner(toDom(htmlStr));
    });

    it('first node is p', () => {
      const node = domRunner.next();

      expect(node.tagName).toEqual('P');
      expect(domRunner.getNodeText()).toEqual('make me bold');
    });

    it('second node is text', () => {
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual('make me ');
    });

    it('third node is strong', () => {
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('STRONG');
    });

    it('fourth node is text node', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual('bold');
    });
  });

  describe('iterate Nodes of list', () => {
    beforeEach(() => {
      const htmlStr = [
        '<ul>',
        '<li>myli <strong>bold</strong></li>',
        '<li><img src="https://www.google.co.kr/images/nav_logo195.png" /> after image</li>',
        '</ul>'
      ].join('');

      domRunner = new DomRunner(toDom(htmlStr));
    });

    it('first node is ul', () => {
      const node = domRunner.next();

      expect(node.tagName).toEqual('UL');
    });

    it('second node is li', () => {
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('LI');
    });

    it('thid node is text node', () => {
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual('myli ');
    });

    it('fourth node is strong', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('STRONG');
    });

    it('fifth node is text node', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual('bold');
    });

    it('sixth node is LI', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('LI');
    });

    it('seventh node is IMG', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.tagName).toEqual('IMG');
      expect(node.src).toEqual('https://www.google.co.kr/images/nav_logo195.png');
    });

    it('eighth node is text', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node.nodeType).toEqual(DomRunner.NODE_TYPE.TEXT_NODE);
      expect(node.nodeValue).toEqual(' after image');
    });

    it('nineth node is null', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();

      const node = domRunner.next();

      expect(node).toBe(null);
    });
  });

  describe('iterate Nodes of table', () => {
    beforeEach(() => {
      const htmlStr = [
        '<table>',
        '<colgroup>',
        '<col align="left">',
        '<col align="right">',
        '</colgroup>',
        '<thead>',
        '<tr>',
        '<th>thtext1</th>',
        '<th>thtext2</th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td>tdtext1</td>',
        '<td>tdtext2</td>',
        '</tr>',
        '</tbody>',
        '</table>'
      ].join('');

      domRunner = new DomRunner(toDom(htmlStr));
    });

    it('check table tags', () => {
      let node;

      node = domRunner.next();
      expect(node.tagName).toEqual('TABLE');

      node = domRunner.next();
      expect(node.tagName).toEqual('COLGROUP');

      node = domRunner.next();
      expect(node.tagName).toEqual('COL');
      expect(node.align).toEqual('left');

      node = domRunner.next();
      expect(node.tagName).toEqual('COL');
      expect(node.align).toEqual('right');

      node = domRunner.next();
      expect(node.tagName).toEqual('THEAD');

      node = domRunner.next();
      expect(node.tagName).toEqual('TR');

      node = domRunner.next();
      expect(node.tagName).toEqual('TH');
    });
  });

  describe('iterate stop when next node is root node', () => {
    beforeEach(() => {
      const htmlStr = [
        '<div>',
        '<p>myli <strong>bold</strong></p>',
        '</div>',
        '<pre>next</pre>'
      ].join('');

      const dom = toDom(htmlStr);

      domRunner = new DomRunner(toDom(dom.firstChild));
    });

    it('no more next over root', () => {
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next();
      domRunner.next(); // root

      expect(domRunner.getNode()).toBeNull();
    });
  });

  describe('get current node', () => {
    beforeEach(() => {
      domRunner = new DomRunner(toDom('<div>currentText</div>'));
    });

    it('check table tags', () => {
      expect(domRunner.next()).toBe(domRunner.getNode());
    });
  });

  describe('if next node is nothing left, returns null', () => {
    beforeEach(() => {
      domRunner = new DomRunner(toDom('<div>currentText</div>'));
    });

    it('domRunner returns null', () => {
      domRunner.next();
      domRunner.next();
      expect(domRunner.next()).toBeNull();
    });
  });

  describe('normalize text nodes', () => {
    beforeEach(() => {
      const dom = toDom('test -');

      dom.appendChild(document.createTextNode('text'));
      domRunner = new DomRunner(dom);
    });

    it('domRunner returns normalized node', () => {
      expect(domRunner.next().nodeValue).toBe('test -text');
    });
  });
});
