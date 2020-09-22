import toDom from '@/toDom';

describe('toDom', () => {
  describe('preProcess html text', () => {
    it('trim html strings', () => {
      const html = toDom.preProcess('   <h1>Hello World!</h1>   ');

      expect(html).toEqual('<h1>Hello World!</h1>');
    });

    it('remove spaces more than 1 between tags', () => {
      const html = toDom.preProcess('<h1>Hello World!</h1>    <h2>Hello World!</h2>');

      expect(html).toEqual('<h1>Hello World!</h1> <h2>Hello World!</h2>');
    });

    it('remove remove returns between tags', () => {
      const html = toDom.preProcess('<h1>hello</h1>\n<h2>world</h2>');

      expect(html).toEqual('<h1>hello</h1><h2>world</h2>');
    });

    it('dont remove remove returns in text node', () => {
      const html = toDom.preProcess('<pre><code>hel\nlo</code></pre>');

      expect(html).toEqual('<pre><code>hel\nlo</code></pre>');
    });

    it('text node can keep one space', () => {
      expect(toDom.preProcess('<p> text </p>')).toEqual('<p> text </p>');
      expect(toDom.preProcess('<code> text </code>')).toEqual('<code> text </code>');
      expect(toDom.preProcess('<pre><code> text </code></pre>')).toEqual(
        '<pre><code> text </code></pre>'
      );
    });
  });

  describe('HTML Text', () => {
    it('convert block tag to dom', () => {
      const dom = toDom('<h1>Hello World!</h1>');
      const [node] = dom.childNodes;
      const nodeText = node.innerText || node.textContent;

      expect(node.tagName).toEqual('H1');
      expect(nodeText).toEqual('Hello World!');
    });

    it('convert inline tag string to dom', () => {
      const dom = toDom('<a href="https://www.google.co.kr/" />');
      const [node] = dom.childNodes;

      expect(node.tagName).toEqual('A');
      expect(node.href).toEqual('https://www.google.co.kr/');
    });

    it('add __htmlRootByToMark property to root element', () => {
      const dom = toDom(
        '<img src="https://www.google.co.kr/images/nav_logo195.png" alt="altText" />'
      );

      expect(dom.__htmlRootByToMark).toBe(true);
    });
  });

  describe('Dom', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
      document.body.innerHTML = '<div id="rootToRender"><h1>Hello World!</h1></div>';
    });

    it('check dom node', () => {
      const dom = toDom(document.getElementById('rootToRender'));
      const [node] = dom.childNodes;
      const nodeText = node.innerText || node.textContent;

      expect(node.tagName).toEqual('H1');
      expect(nodeText).toEqual('Hello World!');
      expect(dom.__htmlRootByToMark).toBe(true);
    });
  });
});
