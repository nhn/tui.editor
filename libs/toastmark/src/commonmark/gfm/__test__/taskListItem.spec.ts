import { source } from 'common-tags';
import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';
import { pos } from '../../__test__/helper.spec';

const reader = new Parser();
const render = createRenderHTML({ gfm: true });

describe('Task list item', () => {
  it('Parse', () => {
    const root = reader.parse(source`
      - [ ] Item1
      -  [x] Item2
      -   [X]  Item3
    `);
    expect(root).toMatchObject({
      firstChild: {
        type: 'list',
        firstChild: {
          type: 'item',
          listData: {
            task: true,
            checked: false
          },
          firstChild: {
            type: 'paragraph',
            sourcepos: pos(1, 7, 1, 11)
          },
          next: {
            type: 'item',
            listData: {
              task: true,
              checked: true
            },
            firstChild: {
              type: 'paragraph',
              sourcepos: pos(2, 8, 2, 12)
            },
            next: {
              type: 'item',
              listData: {
                task: true,
                checked: true
              },
              firstChild: {
                type: 'paragraph',
                sourcepos: pos(3, 10, 3, 14)
              }
            }
          }
        }
      }
    });
  });

  // https://github.github.com/gfm/#example-279
  it('GFM Example 279', () => {
    const input = source`
      - [ ] foo
      - [x] bar
    `;
    const output = source`
      <ul>
      <li><input disabled="" type="checkbox" /> foo</li>
      <li><input checked="" disabled="" type="checkbox" /> bar</li>
      </ul>
    `;

    const root = reader.parse(input);
    const html = render(root);

    expect(html).toEqual(`${output}\n`);
  });

  // https://github.github.com/gfm/#example-280
  it('GFM Example 280', () => {
    const input = source`
      - [x] foo
        - [ ] bar
        - [x] baz
      - [ ] bim
    `;
    const output = source`
      <ul>
      <li><input checked="" disabled="" type="checkbox" /> foo
      <ul>
      <li><input disabled="" type="checkbox" /> bar</li>
      <li><input checked="" disabled="" type="checkbox" /> baz</li>
      </ul>
      </li>
      <li><input disabled="" type="checkbox" /> bim</li>
      </ul>
    `;

    const root = reader.parse(input);
    const html = render(root);

    expect(html).toEqual(`${output}\n`);
  });
});
