import {
  isPositionInBox,
  isElemNode,
  findNodes,
  appendNodes,
  insertBeforeNode,
  removeNode,
  unwrapNode,
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
});
