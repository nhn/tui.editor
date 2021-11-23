import { oneLineTrim } from 'common-tags';
import Viewer from '@/viewer';
import { createHTMLrenderer, removeDataAttr } from './markdown/util';

describe('Viewer', () => {
  let viewer: Viewer, container: HTMLElement;

  function getViewerHTML() {
    return oneLineTrim`${removeDataAttr(
      container.querySelector('.toastui-editor-contents')!.innerHTML
    )}`;
  }

  beforeEach(() => {
    container = document.createElement('div');

    viewer = new Viewer({
      el: container,
      extendedAutolinks: true,
      frontMatter: true,
      initialValue: '# test\n* list1\n* list2',
      customHTMLRenderer: createHTMLrenderer(),
    });

    document.body.appendChild(container);
  });

  afterEach(() => {
    viewer.destroy();
    document.body.removeChild(container);
  });

  it('should render properly', () => {
    const expected = oneLineTrim`
      <h1>test</h1>
      <ul>
        <li>
          <p>list1</p>
        </li>
        <li>
          <p>list2</p>
        </li>
      </ul>
    `;

    expect(getViewerHTML()).toBe(expected);
  });

  it('should update preview by setMarkdown API', () => {
    viewer.setMarkdown('> block quote\n# heading *emph*');

    const expected = oneLineTrim`
      <blockquote><p>block quote</p></blockquote>
      <h1>
        heading <em>emph</em>
      </h1>
    `;

    expect(getViewerHTML()).toBe(expected);
  });

  it('should render htmlBlock properly', () => {
    viewer.setMarkdown(
      '<iframe src="https://www.youtube.com/embed/XyenY12fzAk" height="315" width="420"></iframe>'
    );

    const expected =
      '<iframe width="420" height="315" src="https://www.youtube.com/embed/XyenY12fzAk"></iframe>';

    expect(getViewerHTML()).toBe(expected);
  });
});
