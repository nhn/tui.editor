import { Parser } from '../../blocks';
import { HtmlRenderer } from '../../render/html';
import { convertToArrayTree } from '../../__test__/helper.spec';
import { BlockNode } from 'src/commonmark/node';

const reader = new Parser();
const writer = new HtmlRenderer({ tagFilter: true });

// Shortcut function to prevent prettier from adding linebreak beetween nested arrays
const pos = (a: number, b: number, c: number, d: number) => [
  [a, b],
  [c, d]
];

describe('table', () => {
  it('basic', () => {
    const root = reader.parse('  a |  b\n --|---\nc | d|\n e');
    const result = convertToArrayTree(root, [
      'type',
      'sourcepos',
      'stringContent',
      'literal'
    ] as (keyof BlockNode)[]);

    expect(result).toEqual({
      type: 'document',
      sourcepos: pos(1, 1, 4, 2),
      children: [
        {
          type: 'table',
          sourcepos: pos(1, 3, 4, 2),
          children: [
            {
              type: 'tableHead',
              sourcepos: pos(1, 3, 2, 7),
              children: [
                {
                  type: 'tableRow',
                  sourcepos: pos(1, 3, 1, 8),
                  children: [
                    {
                      type: 'tableCell',
                      sourcepos: pos(1, 3, 1, 3),
                      children: [
                        {
                          type: 'text',
                          literal: 'a',
                          sourcepos: pos(1, 3, 1, 3)
                        }
                      ]
                    },
                    {
                      type: 'tableCell',
                      sourcepos: pos(1, 8, 1, 8),
                      children: [
                        {
                          type: 'text',
                          literal: 'b',
                          sourcepos: pos(1, 8, 1, 8)
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableDelimRow',
                  sourcepos: pos(2, 2, 2, 7),
                  children: [
                    {
                      type: 'tableDelimCell',
                      stringContent: '--',
                      sourcepos: pos(2, 2, 2, 3)
                    },
                    {
                      type: 'tableDelimCell',
                      stringContent: '---',
                      sourcepos: pos(2, 5, 2, 7)
                    }
                  ]
                }
              ]
            },
            {
              type: 'tableBody',
              sourcepos: pos(3, 1, 4, 2),
              children: [
                {
                  type: 'tableRow',
                  sourcepos: pos(3, 1, 3, 6),
                  children: [
                    {
                      type: 'tableCell',
                      sourcepos: pos(3, 1, 3, 1),
                      children: [
                        {
                          type: 'text',
                          literal: 'c',
                          sourcepos: pos(3, 1, 3, 1)
                        }
                      ]
                    },
                    {
                      type: 'tableCell',
                      sourcepos: pos(3, 5, 3, 5),
                      children: [
                        {
                          type: 'text',
                          literal: 'd',
                          sourcepos: pos(3, 5, 3, 5)
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'tableRow',
                  sourcepos: pos(4, 2, 4, 2),
                  children: [
                    {
                      type: 'tableCell',
                      sourcepos: pos(4, 2, 4, 2),
                      children: [
                        {
                          type: 'text',
                          literal: 'e',
                          sourcepos: pos(4, 2, 4, 2)
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
  });
});
