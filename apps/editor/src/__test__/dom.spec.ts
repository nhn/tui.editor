import { isInBox } from '@/wysiwyg/helper/dom';

describe('dom utils', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.parentNode!.removeChild(container);
  });

  it('isInBox() returns state whether position is contained within box size', () => {
    container.innerHTML = '<div class="test">foo</div>';

    const div = document.querySelector('.test') as HTMLElement;
    const { style } = div;

    style.left = '0';
    style.top = '0';
    style.width = '10px';
    style.height = '10px';

    expect(isInBox(style, 5, 5)).toBe(true);
    expect(isInBox(style, 15, 15)).toBe(false);
  });
});
