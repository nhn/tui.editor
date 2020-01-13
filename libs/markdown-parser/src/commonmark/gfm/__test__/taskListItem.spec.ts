import { Parser } from '../../blocks';
import { ListNode } from '../../node';
import { HtmlRenderer } from '../../render/html';
import { source } from 'common-tags';

const reader = new Parser();
const writer = new HtmlRenderer();

describe('Task list item', () => {
  it('Parse', () => {
    const root = reader.parse(source`
      -  [ ] Hello
      - [x]   World
    `);
    const list = root.firstChild!;
    const item1 = list.firstChild as ListNode;
    const itemPara1 = item1.firstChild!;
    const itemText1 = itemPara1.firstChild!;
    const item2 = item1.next as ListNode;
    const itemPara2 = item2.firstChild!;
    const itemText2 = itemPara2.firstChild!;

    expect(item1.listData!.task).toBe(true);
    expect(item1.listData!.checked).toBe(false);
    expect(itemText1.literal).toBe('Hello');
    expect(itemPara1.sourcepos).toEqual([
      [1, 8],
      [1, 12]
    ]);
    expect(itemText1.sourcepos).toEqual([
      [1, 8],
      [1, 12]
    ]);

    expect(item2.listData!.task).toBe(true);
    expect(item2.listData!.checked).toBe(true);
    expect(itemText2.literal).toBe('World');
    expect(itemPara2.sourcepos).toEqual([
      [2, 9],
      [2, 13]
    ]);
    expect(itemText2.sourcepos).toEqual([
      [2, 9],
      [2, 13]
    ]);
  });

  // https://github.github.com/gfm/#example-279
  it('GFM Example 279', () => {
    const input = source`
      - [ ] foo
      - [x] bar
    `;
    const output = source`
      <ul>
      <li><input disabled="" type="checkbox"> foo</li>
      <li><input checked="" disabled="" type="checkbox"> bar</li>
      </ul>
    `;

    const root = reader.parse(input);
    const html = writer.render(root);

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
      <li><input checked="" disabled="" type="checkbox"> foo
      <ul>
      <li><input disabled="" type="checkbox"> bar</li>
      <li><input checked="" disabled="" type="checkbox"> baz</li>
      </ul>
      </li>
      <li><input disabled="" type="checkbox"> bim</li>
      </ul>
    `;

    const root = reader.parse(input);
    const html = writer.render(root);

    expect(html).toEqual(`${output}\n`);
  });
});
