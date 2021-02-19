import { oneLineTrim } from 'common-tags';
import Viewer from '@/viewer';

describe('Viewer', () => {
  let viewer: Viewer, container: HTMLElement;

  function getViewerHTML() {
    return oneLineTrim`${container
      .querySelector('.tui-editor-contents')!
      .innerHTML.replace(/\sdata-nodeid="\d{1,}"/g, '')}`;
  }

  beforeEach(() => {
    container = document.createElement('div');

    viewer = new Viewer({
      el: container,
      extendedAutolinks: true,
      frontMatter: true,
      initialValue: '# test\n* list1\n* list2',
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
});
