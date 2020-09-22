import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';
import { convertToArrayTree } from '../../__test__/helper.spec';
import { BlockNode, TableNode } from 'src/commonmark/node';
import { source } from 'common-tags';

const reader = new Parser();
const render = createRenderHTML({ gfm: true });

// Shortcut function to prevent prettier from adding linebreak beetween nested arrays
const pos = (a: number, b: number, c: number, d: number) => [
  [a, b],
  [c, d]
];

describe('table', () => {
  it('basic', () => {
    const root = reader.parse('  a |  b\n --| ---\n|  c |  |\n e');
    const result = convertToArrayTree(root, [
      'type',
      'sourcepos',
      'stringContent',
      'paddingLeft',
      'paddingRight',
      'literal'
    ] as (keyof BlockNode)[]);

    expect(result).toEqual({
      type: 'document',
      sourcepos: pos(1, 1, 4, 2),
      children: [
        {
          type: 'table',
          sourcepos: pos(1, 3, 3, 9),
          children: [
            {
              type: 'tableHead',
              sourcepos: pos(1, 3, 2, 8),
              children: [
                {
                  type: 'tableRow',
                  sourcepos: pos(1, 3, 1, 8),
                  children: [
                    {
                      type: 'tableCell',
                      paddingLeft: 0,
                      paddingRight: 1,
                      sourcepos: pos(1, 3, 1, 4),
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
                      paddingLeft: 2,
                      paddingRight: 0,
                      sourcepos: pos(1, 6, 1, 8),
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
                  sourcepos: pos(2, 2, 2, 8),
                  children: [
                    {
                      type: 'tableDelimCell',
                      paddingLeft: 0,
                      paddingRight: 0,
                      stringContent: '--',
                      sourcepos: pos(2, 2, 2, 3)
                    },
                    {
                      type: 'tableDelimCell',
                      paddingLeft: 1,
                      paddingRight: 0,
                      stringContent: '---',
                      sourcepos: pos(2, 5, 2, 8)
                    }
                  ]
                }
              ]
            },
            {
              type: 'tableBody',
              sourcepos: pos(3, 1, 3, 9),
              children: [
                {
                  type: 'tableRow',
                  sourcepos: pos(3, 1, 3, 9),
                  children: [
                    {
                      type: 'tableCell',
                      paddingLeft: 2,
                      paddingRight: 1,
                      sourcepos: pos(3, 2, 3, 5),
                      children: [
                        {
                          type: 'text',
                          literal: 'c',
                          sourcepos: pos(3, 4, 3, 4)
                        }
                      ]
                    },
                    {
                      type: 'tableCell',
                      paddingLeft: 0,
                      paddingRight: 0,
                      sourcepos: pos(3, 7, 3, 8)
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'paragraph',
          sourcepos: pos(4, 2, 4, 2),
          children: [
            {
              type: 'text',
              sourcepos: pos(4, 2, 4, 2),
              literal: 'e'
            }
          ]
        }
      ]
    });

    const html = render(root);
    const output = source`
      <table>
      <thead>
      <tr>
      <th>a</th>
      <th>b</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>c</td>
      <td></td>
      </tr>
      </tbody>
      </table>
      <p>e</p>
    `;
    expect(html).toBe(`${output}\n`);
  });

  it('preceded by non-empty line', () => {
    const input = source`
      Hello
      World
      | a | b |
      | - | - |
      | c | d |
    `;
    const root = reader.parse(input);
    const result = convertToArrayTree(root, ['type', 'sourcepos'] as (keyof BlockNode)[]);

    expect(result).toMatchObject({
      type: 'document',
      children: [
        {
          type: 'paragraph',
          sourcepos: pos(1, 1, 2, 5)
        },
        {
          type: 'table',
          sourcepos: pos(3, 1, 5, 9)
        }
      ]
    });
  });

  it('with aligns', () => {
    const root = reader.parse('left | center | right\n:--- | :---: | ---:\na | b | c');
    const tableNode = root.firstChild as TableNode;

    expect(tableNode.columns).toEqual([{ align: 'left' }, { align: 'center' }, { align: 'right' }]);
  });

  it('with empty cells', () => {
    const input = source`
      | a |  |  |
      | - | - | - |
      |  | b |  |
      |  |  | c |
    `;
    const output = source`
      <table>
      <thead>
      <tr>
      <th>a</th>
      <th></th>
      <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td></td>
      <td>b</td>
      <td></td>
      </tr>
      <tr>
      <td></td>
      <td></td>
      <td>c</td>
      </tr>
      </tbody>
      </table>
    `;

    const root = reader.parse(input);
    const html = render(root);
    expect(html).toBe(`${output}\n`);
  });
});

describe('GFM Exmaple', () => {
  const examples = [
    {
      no: 198,
      input: source`
        | foo | bar |
        | --- | --- |
        | baz | bim |
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>foo</th>
        <th>bar</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>baz</td>
        <td>bim</td>
        </tr>
        </tbody>
        </table>
      `
    },
    {
      no: 199,
      input: source`
        | abc | defghi |
        :-: | -----------:
        bar | baz
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th align="center">abc</th>
        <th align="right">defghi</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td align="center">bar</td>
        <td align="right">baz</td>
        </tr>
        </tbody>
        </table>
      `
    },
    {
      no: 200,
      input: source`
        | f\\|oo  |
        | ------ |
        | b \`\\|\` az |
        | b **\\|** im |
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>f|oo</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>b <code>|</code> az</td>
        </tr>
        <tr>
        <td>b <strong>|</strong> im</td>
        </tr>
        </tbody>
        </table>
      `
    },
    {
      no: 201,
      input: source`
        | abc | def |
        | --- | --- |
        | bar | baz |
        > bar
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>abc</th>
        <th>def</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>bar</td>
        <td>baz</td>
        </tr>
        </tbody>
        </table>
        <blockquote>
        <p>bar</p>
        </blockquote>
      `
    },
    {
      no: 202,
      input: source`
        | abc | def |
        | --- | --- |
        | bar | baz |
        bar

        bar
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>abc</th>
        <th>def</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>bar</td>
        <td>baz</td>
        </tr>
        </tbody>
        </table>
        <p>bar</p>
        <p>bar</p>
      `
    },
    // TODO: need to find a way to parse merged-column and re-activate this test case
    // {
    //   no: 203,
    //   input: source`
    //     | abc | def |
    //     | --- |
    //     | bar |
    //   `,
    //   output: source`
    //     <p>| abc | def |
    //     | --- |
    //     | bar |</p>
    //   `
    // },
    {
      no: 204,
      input: source`
        | abc | def |
        | --- | --- |
        | bar |
        | bar | baz | boo |
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>abc</th>
        <th>def</th>
        </tr>
        </thead>
        <tbody>
        <tr>
        <td>bar</td>
        <td></td>
        </tr>
        <tr>
        <td>bar</td>
        <td>baz</td>
        </tr>
        </tbody>
        </table>
      `
    },
    {
      no: 205,
      input: source`
        | abc | def |
        | --- | --- |
      `,
      output: source`
        <table>
        <thead>
        <tr>
        <th>abc</th>
        <th>def</th>
        </tr>
        </thead>
        </table>
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
