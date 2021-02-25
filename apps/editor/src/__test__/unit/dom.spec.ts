import toArray from 'tui-code-snippet/collection/toArray';
import {
  isPositionInBox,
  isElemNode,
  findNodes,
  appendNodes,
  insertBeforeNode,
  removeNode,
  unwrapNode,
  toggleClass,
  createElementWith,
  closest,
  empty,
  appendNode,
  prependNode,
} from '@/utils/dom';

describe('dom utils', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.parentNode!.removeChild(container);
  });

  it('isPositionInBox() returns state whether position is contained within box size', () => {
    container.innerHTML = '<div class="test">foo</div>';

    const el = document.querySelector('.test') as HTMLElement;
    const { style } = el;

    style.left = '0';
    style.top = '0';
    style.width = '10px';
    style.height = '10px';
    style.paddingLeft = '0';
    style.paddingRight = '0';
    style.paddingTop = '0';
    style.paddingBottom = '0';

    expect(isPositionInBox(style, 5, 5)).toBe(true);
    expect(isPositionInBox(style, 15, 15)).toBe(false);
  });

  describe('isElemNode', () => {
    it('returns true if passed node is ELEMENT_NODE', () => {
      container.innerHTML = '<p>hi</p>';

      const target = container.querySelector('p') as HTMLElement;
      const result = isElemNode(target);

      expect(result).toBe(true);
    });

    it('returns false if passed node is not ELEMENT_NODE', () => {
      container.innerHTML = 'text';

      const result = isElemNode(container.firstChild!);

      expect(result).toBe(false);
    });
  });

  it('appendNodes() appends last child to parent using dom element', () => {
    container.innerHTML = '<div>foo</div>';

    const el = document.createElement('p');

    el.innerHTML = 'bar';

    const target = container.querySelector('div') as HTMLElement;

    appendNodes(target, el);

    expect(container.innerHTML).toBe('<div>foo<p>bar</p></div>');
  });

  it('insertBeforeNode() inserts node in front of target node', () => {
    container.innerHTML = '<div>foo</div>';

    const el = document.createElement('p');

    el.innerHTML = 'bar';

    const target = container.querySelector('div') as HTMLElement;

    insertBeforeNode(el, target);

    expect(container.innerHTML).toBe('<p>bar</p><div>foo</div>');
  });

  it('removeNode() removes target node', () => {
    container.innerHTML = '<div><p>foo</p><p>bar</p></div>';

    const target = container.querySelector('p') as HTMLElement;

    removeNode(target);

    expect(container.innerHTML).toBe('<div><p>bar</p></div>');
  });

  it('unwrapNode() removes given element and insert children at the same position', () => {
    const childrenHTML = '<i>emph1</i> text <i>emph2</i>';

    container.innerHTML = `<p><b>${childrenHTML}</b></p>`;

    const target = container.querySelector('b') as HTMLElement;

    unwrapNode(target);

    expect(container.innerHTML).toBe(`<p>${childrenHTML}</p>`);
  });

  describe('findNodes() returns nodes matching by selector', () => {
    beforeEach(() => {
      container.innerHTML = '<div>foo</div><div>bar</div>';
    });

    it('to array when found', () => {
      const result = findNodes(container, 'div');

      expect(result.length).toBe(2);
      expect(result[0].textContent).toBe('foo');
      expect(result[1].textContent).toBe('bar');
    });

    it('to empty array when not found', () => {
      const result = findNodes(container, '.test');

      expect(result.length).toBe(0);
    });
  });

  describe('toggleClass() adds or removes specific class name of element', () => {
    beforeEach(() => {
      container.innerHTML = '<div class="test">foo</div>';
    });

    it('only toggle class', () => {
      const target = container.querySelector('div')!;

      toggleClass(target, 'active');
      expect(target.className).toBe('test active');

      toggleClass(target, 'active');
      expect(target.className).toBe('test');
    });

    it('add or remove class by condition', () => {
      const target = container.querySelector('div')!;

      toggleClass(target, 'active', true);
      expect(target.className).toBe('test active');

      toggleClass(target, 'active1', false);
      expect(target.className).toBe('test active');

      toggleClass(target, 'active', false);
      expect(target.className).toBe('test');
    });
  });

  describe('createElementWith() returns created new element using', () => {
    it('html string', () => {
      const result = createElementWith('<p>foo</p>')!;

      expect(result.textContent).toBe('foo');
    });

    it('dom element', () => {
      const element = document.createElement('p');

      element.innerHTML = 'foo';

      const result = createElementWith(element)!;

      expect(result.textContent).toBe('foo');
    });

    it('if there is target element, new element is appended to target', () => {
      container.innerHTML = '<div></div>';

      const target = container.querySelector('div')!;
      const result = createElementWith('<p>foo</p>', target)!;

      expect(result.parentNode).toBe(target);
    });
  });

  describe('closest() finds node with', () => {
    beforeEach(() => {
      container.innerHTML = '<ul><li>foo</li><li class="test">bar</li></ul>';
    });

    it('type selector from text node', () => {
      const selector = 'li';
      const [target] = toArray(container.querySelectorAll('li'));
      const foundNode = closest(target.firstChild!, selector);
      const result = container.querySelector(selector);

      expect(foundNode).toBe(result);
    });

    it('attribute selector from text node', () => {
      const selector = '.test';
      const [, target] = toArray(container.querySelectorAll('li'));
      const foundNode = closest(target.firstChild!, selector);
      const result = container.querySelector(selector);

      expect(foundNode).toBe(result);
    });

    it('type selector from element node', () => {
      const selector = 'UL';
      const target = container.querySelector('li')!;

      const foundNode = closest(target, selector);
      const result = container.querySelector(selector);

      expect(foundNode).toBe(result);
    });

    it('wrong selector', () => {
      const selector = 'wrong selector';
      const target = container.querySelector('li')!;

      const foundNode = closest(target, selector);

      expect(foundNode).toBeNull();
    });

    it('dom element', () => {
      const target = container.querySelector('li')!;
      const selector = container.querySelector('ul')!;

      const foundNode = closest(target, selector)!;

      expect(foundNode).toEqual(selector);
    });
  });

  it('empty() removes all children from target node', () => {
    container.innerHTML = '<div><p>foo</p><p>bar</p></div>';

    const target = container.querySelector('div')!;

    empty(target);

    expect(container.innerHTML).toBe('<div></div>');
  });

  describe('appendNode() appends last child to parent using', () => {
    beforeEach(() => {
      container.innerHTML = '<div>foo</div>';
    });

    it('html string', () => {
      appendNode(container.querySelector('div')!, '<p>bar</p>');

      expect(container.innerHTML).toBe('<div>foo<p>bar</p></div>');
    });

    it('dom element', () => {
      const child = document.createElement('p');

      child.innerHTML = 'bar';

      appendNode(container.querySelector('div')!, child);

      expect(container.innerHTML).toBe('<div>foo<p>bar</p></div>');
    });
  });

  describe('prependNode() appends first child to parent using', () => {
    beforeEach(() => {
      container.innerHTML = '<div>foo</div>';
    });

    it('html string', () => {
      prependNode(container.querySelector('div')!, '<p>bar</p>');

      expect(container.innerHTML).toBe('<div><p>bar</p>foo</div>');
    });

    it('dom element', () => {
      const child = document.createElement('p');

      child.innerHTML = 'bar';

      prependNode(container.querySelector('div')!, child);

      expect(container.innerHTML).toBe('<div><p>bar</p>foo</div>');
    });
  });
});
