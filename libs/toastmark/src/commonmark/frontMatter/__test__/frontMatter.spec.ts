import { source } from 'common-tags';
import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';

const reader = new Parser({ frontMatter: true });
const render = createRenderHTML();

describe('front matter parsing', () => {
  it('basic', () => {
    const root = reader.parse('---\ntitle: front matter\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'paragraph',
        customType: 'frontMatter',
        sourcepos: [
          [1, 1],
          [3, 3]
        ],
        firstChild: {
          type: 'text',
          literal: '---',
          sourcepos: [
            [1, 1],
            [1, 3]
          ],
          next: {
            type: 'softbreak',
            next: {
              type: 'text',
              literal: 'title: front matter',
              sourcepos: [
                [2, 1],
                [2, 19]
              ],
              next: {
                type: 'softbreak',
                next: {
                  literal: '---',
                  next: null,
                  sourcepos: [
                    [3, 1],
                    [3, 3]
                  ]
                }
              }
            }
          }
        }
      }
    });
  });

  it('front matter includes empty line', () => {
    const root = reader.parse('---\n\ntitle: front matter\n\ndescription: with empty line\n\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'paragraph',
        customType: 'frontMatter',
        stringContent: null,
        lastLineBlank: true,
        sourcepos: [
          [1, 1],
          [1, 3]
        ],
        firstChild: {
          type: 'text',
          literal: '---',
          sourcepos: [
            [1, 1],
            [1, 3]
          ]
        },
        next: {
          type: 'paragraph',
          customType: 'frontMatter',
          firstChild: {
            type: 'text',
            literal: 'title: front matter',
            sourcepos: [
              [3, 1],
              [3, 19]
            ]
          },
          lastLineBlank: true,
          sourcepos: [
            [3, 1],
            [3, 19]
          ],
          next: {
            type: 'paragraph',
            customType: 'frontMatter',
            firstChild: {
              type: 'text',
              literal: 'description: with empty line',
              sourcepos: [
                [5, 1],
                [5, 28]
              ]
            },
            lastLineBlank: true,
            sourcepos: [
              [5, 1],
              [5, 28]
            ],
            next: {
              type: 'paragraph',
              customType: 'frontMatter',
              firstChild: {
                type: 'text',
                literal: '---',
                sourcepos: [
                  [7, 1],
                  [7, 3]
                ]
              },
              lastLineBlank: false,
              sourcepos: [
                [7, 1],
                [7, 3]
              ]
            }
          }
        }
      }
    });
  });

  it('top empty line with front matter', () => {
    const root = reader.parse('\n---\ntitle: front matter\n---');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'paragraph',
        customType: 'frontMatter',
        sourcepos: [
          [2, 1],
          [4, 3]
        ],
        firstChild: {
          type: 'text',
          literal: '---',
          sourcepos: [
            [2, 1],
            [2, 3]
          ],
          next: {
            type: 'softbreak',
            next: {
              type: 'text',
              literal: 'title: front matter',
              sourcepos: [
                [3, 1],
                [3, 19]
              ],
              next: {
                type: 'softbreak',
                next: {
                  literal: '---',
                  next: null,
                  sourcepos: [
                    [4, 1],
                    [4, 3]
                  ]
                }
              }
            }
          }
        }
      }
    });
  });

  it('front matter with following paragraph', () => {
    const root = reader.parse('---\ntitle: front matter\n---\npara');

    expect(root).toMatchObject({
      type: 'document',
      firstChild: {
        type: 'paragraph',
        customType: 'frontMatter',
        sourcepos: [
          [1, 1],
          [3, 3]
        ],
        firstChild: {
          type: 'text',
          literal: '---',
          sourcepos: [
            [1, 1],
            [1, 3]
          ],
          next: {
            type: 'softbreak',
            next: {
              type: 'text',
              literal: 'title: front matter',
              sourcepos: [
                [2, 1],
                [2, 19]
              ],
              next: {
                type: 'softbreak',
                next: {
                  literal: '---',
                  next: null,
                  sourcepos: [
                    [3, 1],
                    [3, 3]
                  ]
                }
              }
            }
          }
        },
        next: {
          type: 'paragraph',
          customType: null,
          stringContent: null,
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
        <p></p>
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
        <p></p>
        <p></p>
        <p></p>
        <p></p>
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
        <p></p>
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
        <p></p>
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
      const html = render(root);
      expect(html).toBe(`${output}\n`);
    });
  });
});
