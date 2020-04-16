import { Parser } from '../../commonmark/blocks';
import { createRenderHTML, OpenTagToken } from '../render';

const parser = new Parser();

describe('softbreak options', () => {
  it('softbreak option value should be used as a raw HTML string', () => {
    const render = createRenderHTML({
      softbreak: '\n<br />\n'
    });
    const html = render(parser.parse('Hello\nWorld'));

    expect(html).toBe('<p>Hello\n<br />\nWorld</p>\n');
  });
});

describe('nodeId options', () => {
  const render = createRenderHTML({ nodeId: true });

  it('every html tag corresponds to container node should contain data-nodeid', () => {
    const root = parser.parse('*Hello* **World**');
    const para = root.firstChild!;
    const emph = para.firstChild!;
    const strong = emph.next!.next!;

    expect(render(root)).toBe(
      [
        `<p data-nodeid="${para.id}">`,
        `<em data-nodeid="${emph.id}">Hello</em> `,
        `<strong data-nodeid="${strong.id}">World</strong>`,
        '</p>\n'
      ].join('')
    );
  });

  it('htmlBlock should be wrapped by div to contain data-nodeid', () => {
    const root = parser.parse('<li>Hi</li>');
    const htmlBlock = root.firstChild!;

    expect(render(root)).toBe(`<div data-nodeid="${htmlBlock.id}"><li>Hi</li></div>\n`);
  });

  it('only top-level tag for each node should contain data-nodeid', () => {
    const root = parser.parse('```\nHello\n```');
    const codeBlock = root.firstChild!;

    expect(render(root)).toBe(`<pre data-nodeid="${codeBlock.id}"><code>Hello\n</code></pre>\n`);
  });
});

describe('convertors options', () => {
  it('should pass the context object to convertor', () => {
    const spy = jest.fn(() => null);
    const options = {
      gfm: true,
      softbreak: '<br />\n',
      nodeId: true
    };
    const render = createRenderHTML({
      ...options,
      convertors: {
        paragraph: spy
      }
    });
    const root = parser.parse('Hello World');
    render(root);

    expect(spy).toHaveBeenCalledTimes(2);

    const firstCall = spy.mock.calls[0] as any[];
    expect(firstCall[0]).toBe(root.firstChild);
    expect(firstCall[1]).toMatchObject({
      entering: true,
      leaf: false,
      options
    });

    const secondCall = spy.mock.calls[1] as any[];
    expect(secondCall[0]).toBe(root.firstChild);
    expect(secondCall[1]).toMatchObject({
      entering: false,
      leaf: false,
      options
    });
  });

  it('context object has origin convertor', () => {
    const render = createRenderHTML({
      convertors: {
        paragraph(_, { entering, origin }) {
          const result = origin!();
          if (entering) {
            (result as OpenTagToken).classNames = ['my-class'];
            return result;
          }
          return result;
        }
      }
    });
    const html = render(parser.parse('Hello World'));

    expect(html).toBe('<p class="my-class">Hello World</p>\n');
  });
});
