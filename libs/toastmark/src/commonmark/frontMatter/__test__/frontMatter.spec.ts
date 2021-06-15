import { source, stripIndent } from 'common-tags';
import { Parser } from '../../blocks';
import { Renderer } from '../../../html/renderer';

const reader = new Parser({ frontMatter: true });
const renderer = new Renderer();

describe('front matter', () => {
  it('should be parsed with YAML(`---`)', () => {
    const frontMatterText = stripIndent`
      ---
      title: front matter
      ---
    `;
    const root = reader.parse(frontMatterText);

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: frontMatterText,
        sourcepos: [
          [1, 1],
          [3, 3],
        ],
      },
    });
  });

  it('should be parsed with TOML(`+++`)', () => {
    const frontMatterText = stripIndent`
      +++
      title: front matter
      +++
    `;
    const root = reader.parse(frontMatterText);

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: frontMatterText,
        sourcepos: [
          [1, 1],
          [3, 3],
        ],
      },
    });
  });

  it('should be parsed with JSON(`;;;`)', () => {
    const frontMatterText = stripIndent`
      ;;;
      title: front matter
      ;;;
    `;
    const root = reader.parse(frontMatterText);

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: frontMatterText,
        sourcepos: [
          [1, 1],
          [3, 3],
        ],
      },
    });
  });

  it('should be parsed with the empty line', () => {
    const markdownText = stripIndent`
      ---

      title: front matter

      description: with empty line

      ---
    `;
    const root = reader.parse(markdownText);

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: markdownText,
        sourcepos: [
          [1, 1],
          [7, 3],
        ],
      },
    });
  });

  it('should be parsed with following paragraph', () => {
    const root = reader.parse('---\ntitle: front matter\n---\npara');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: '---\ntitle: front matter\n---',
        sourcepos: [
          [1, 1],
          [3, 3],
        ],
      },
      lastChild: {
        type: 'paragraph',
        literal: null,
        sourcepos: [
          [4, 1],
          [4, 4],
        ],
        firstChild: {
          literal: 'para',
          sourcepos: [
            [4, 1],
            [4, 4],
          ],
        },
      },
    });
  });

  it('should be parsed only once from the top.', () => {
    const frontMatterText = stripIndent`
      ---

      title: front matter

      description: with empty line

      ---
    `;
    const markdownText = `${frontMatterText}\n---`;
    const root = reader.parse(markdownText);

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'frontMatter',
        literal: frontMatterText,
        sourcepos: [
          [1, 1],
          [7, 3],
        ],
        next: {
          type: 'thematicBreak',
          literal: null,
          sourcepos: [
            [8, 1],
            [8, 3],
          ],
        },
      },
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
      `,
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
      `,
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
      `,
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
      `,
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
      `,
    },
  ];

  examples.forEach(({ no, input, output }) => {
    it(String(no), () => {
      const root = reader.parse(input);
      const html = renderer.render(root);
      expect(html).toBe(`${output}\n`);
    });
  });
});
