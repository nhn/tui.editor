import { Parser } from '../../blocks';
import { HtmlRenderer } from '../../render/html';
import { convertToArrayTree } from '../../__test__/helper.spec';
import { BlockNode } from 'src/commonmark/node';

const reader = new Parser();
const writer = new HtmlRenderer({ tagFilter: true });

describe('table', () => {
  it('basic', () => {
    const root = reader.parse('  a |  b\n  --|--');
    const result = convertToArrayTree(root, [
      'type',
      'sourcepos',
      'stringContent'
    ] as (keyof BlockNode)[]);

    expect(result).toEqual({
      type: 'document',
      sourcepos: [
        [1, 1],
        [2, 7]
      ],
      children: [
        {
          type: 'table',
          sourcepos: [
            [1, 3],
            [2, 7]
          ],
          children: [
            {
              type: 'tableHead',
              sourcepos: [
                [1, 3],
                [2, 7]
              ],
              children: [
                {
                  type: 'tableRow',
                  sourcepos: [
                    [1, 3],
                    [1, 8]
                  ],
                  children: [
                    {
                      type: 'tableCell',
                      stringContent: 'a ',
                      sourcepos: [
                        [1, 3],
                        [1, 4]
                      ]
                    },
                    {
                      type: 'tableCell',
                      stringContent: '  b',
                      sourcepos: [
                        [1, 6],
                        [1, 8]
                      ]
                    }
                  ]
                },
                {
                  type: 'tableDelimRow',
                  sourcepos: [
                    [2, 3],
                    [2, 7]
                  ],
                  children: [
                    {
                      type: 'tableCell',
                      stringContent: '--',
                      sourcepos: [
                        [2, 3],
                        [2, 4]
                      ]
                    },
                    {
                      type: 'tableCell',
                      stringContent: '--',
                      sourcepos: [
                        [2, 6],
                        [2, 7]
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
  // it('basic', () => {
  //   // reader.parse('```\nlet hello;\nlet hi;\n```\n');

  //   const root = reader.parse(' a |  b\n  --|--');
  //   // const html = writer.render(root);
  //   console.log(root);

  //   // console.log(root.firstChild!.type);
  //   const table = root.firstChild!;
  //   const tableHead = table.firstChild!;
  //   const tableHeadRow = tableHead.firstChild!;
  //   const tableHeadCell1 = tableHeadRow.firstChild as BlockNode;
  //   const tableHeadCell2 = tableHeadCell1.next as BlockNode;
  //   const tableDelimRow = tableHeadRow.next!;
  //   const tableDelimCell1 = tableDelimRow.firstChild as BlockNode;
  //   const tableDelimCell2 = tableDelimCell1.next as BlockNode;
  //   const tableBody = tableHead.next!;

  //   expect(table.type).toBe('table');
  //   expect(tableHead.type).toBe('tableHead');
  //   expect(tableHeadRow.type).toBe('tableRow');
  //   expect(tableHeadCell1.type).toBe('tableCell');
  //   expect(tableHeadCell2.type).toBe('tableCell');
  //   expect(tableHeadCell1.stringContent).toBe('a ');
  //   expect(tableHeadCell2.stringContent).toBe('  b');
  //   expect(tableDelimRow.type).toBe('tableRow');
  //   expect(tableDelimCell1.type).toBe('tableCell');
  //   expect(tableDelimCell2.type).toBe('tableCell');
  //   expect(tableDelimCell1.stringContent).toBe('  --');
  //   expect(tableDelimCell2.stringContent).toBe('--');

  //   expect(tableBody.type).toBe('tableBody');
  //   // expect(tableBody.type).toBe('tableBody');
  // });
});
