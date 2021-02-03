import { source } from 'common-tags';
import { Parser } from '../../blocks';
import { Renderer } from '../../../html/render';

const reader = new Parser({ frontMatter: true });
const renderer = new Renderer();

describe('front matter parsing', () => {
  it('basic', () => {
    const root = reader.parse('---\ntitle: front matter\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: '---\ntitle: front matter\n---',
        sourcepos: [
          [1, 1],
          [3, 3]
        ]
      }
    });
  });

  it('front matter includes empty line', () => {
    const root = reader.parse('---\n\ntitle: front matter\n\ndescription: with empty line\n\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: '---\n\ntitle: front matter\n\ndescription: with empty line\n\n---',
        sourcepos: [
          [1, 1],
          [7, 3]
        ]
      }
    });
  });

  it('top empty line with front matter', () => {
    const root = reader.parse('\n---\ntitle: front matter\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: '---\ntitle: front matter\n---',
        sourcepos: [
          [2, 1],
          [4, 3]
        ]
      }
    });
  });

  it('front matter with following paragraph', () => {
    const root = reader.parse('---\ntitle: front matter\n---\npara');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: '---\ntitle: front matter\n---',
        sourcepos: [
          [1, 1],
          [3, 3]
        ]
      },
      lastChild: {
        type: 'paragraph',
        literal: null,
        sourcepos: [
          [4, 1],
          [4, 4]
        ],
        firstChild: {
          literal: 'para',
          sourcepos: [
            [4, 1],
            [4, 4]
          ]
        }
      }
    });
  });
});

describe('Exmaple', () => {
  const examples = [
    {
      no: 1,
      input: source`
      ---
      title: front matter
      ---
      `,
      output: source`
        <div style="white-space: pre; display: none;">---
        title: front matter
        ---</div>
      `
    },
    {
      no: 2,
      input: source`
      ---

      title: front matter

      description: with empty line

      ---
      `,
      output: source`
        <div style="white-space: pre; display: none;">---

        title: front matter

        description: with empty line

        ---</div>
      `
    },
    {
      no: 3,
      input: source`

      ---
      title: front matter
      ---
      `,
      output: source`
        <div style="white-space: pre; display: none;">---
        title: front matter
        ---</div>
      `
    },
    {
      no: 4,
      input: source`
      ---
      title: front matter
      ---
      para
      `,
      output: source`
        <div style="white-space: pre; display: none;">---
        title: front matter
        ---</div>
        <p>para</p>
      `
    },
    {
      no: 5,
      input: source`
      para
      ---
      title: front matter
      ---
      `,
      output: source`
        <h2>para</h2>
        <h2>title: front matter</h2>
      `
    }
  ];

  examples.forEach(({ no, input, output }) => {
    it(String(no), () => {
      const root = reader.parse(input);
      const html = renderer.render(root);
      expect(html).toBe(`${output}\n`);
    });
  });
});
