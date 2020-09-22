import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';
import { source } from 'common-tags';

const reader = new Parser({ smart: true });
const render = createRenderHTML({ gfm: true });

describe('smart punctuation', () => {
  it('single quote', () => {
    const root = reader.parse(`Hello *'World'*`);
    const html = render(root);

    expect(html).toBe('<p>Hello <em>\u2018World\u2019</em></p>\n');
  });

  it('double quote', () => {
    const root = reader.parse(`Hello "*World*"`);
    const html = render(root);

    expect(html).toBe('<p>Hello \u201C<em>World</em>\u201D</p>\n');
  });
});

describe('strikethrough', () => {
  // https://github.github.com/gfm/#example-491
  it('GFM Example 491', () => {
    const root = reader.parse('~~Hi~~ Hello, world!');
    const html = render(root);

    expect(html).toBe('<p><del>Hi</del> Hello, world!</p>\n');
  });

  it('GFM Example 492', () => {
    const input = source`
      This ~~has a

      new paragraph~~.
    `;
    const output = source`
      <p>This ~~has a</p>
      <p>new paragraph~~.</p>
    `;

    const root = reader.parse(input);
    const html = render(root);

    expect(html).toEqual(`${output}\n`);
  });

  it('basic example', () => {
    const root = reader.parse('Hello ~~World~~');
    const para = root.firstChild!;
    const text = para.firstChild!;
    const strike = text.next!;
    const strikeText = strike.firstChild!;

    expect(text.literal).toBe('Hello ');
    expect(strikeText.literal).toBe('World');
    expect(strike.sourcepos).toEqual([
      [1, 7],
      [1, 15]
    ]);
    expect(strikeText.sourcepos).toEqual([
      [1, 9],
      [1, 13]
    ]);

    const html = render(root);

    expect(html).toBe('<p>Hello <del>World</del></p>\n');
  });

  it('complex delimiters', () => {
    // 6 long delimiter-run after 'Hello' can be both open and close delimiter
    const root = reader.parse('~~Hello~~~~~~World~~~');
    const para = root.firstChild!;
    const strike1 = para.firstChild!;
    const text1 = strike1.next!;
    const strike2 = text1.next!;
    const text2 = strike2.next!;

    expect(strike1.firstChild!.literal).toBe('Hello');
    expect(text1.literal).toBe('~~');
    expect(strike2.firstChild!.literal).toBe('World');
    expect(text2.literal).toBe('~');

    expect(strike1.sourcepos).toEqual([
      [1, 1],
      [1, 9]
    ]);
    expect(text1.sourcepos).toEqual([
      [1, 10],
      [1, 11]
    ]);
    expect(strike2.sourcepos).toEqual([
      [1, 12],
      [1, 20]
    ]);
    expect(text2.sourcepos).toEqual([
      [1, 21],
      [1, 21]
    ]);

    const html = render(root);

    expect(html).toBe('<p><del>Hello</del>~~<del>World</del>~</p>\n');
  });

  it('nested delimiters (only strikethrough)', () => {
    const root = reader.parse('Hello~~~~~~World~~~~~');
    const para = root.firstChild!;
    const text1 = para.firstChild!;
    const strike1 = text1.next!;
    const strike2 = strike1.firstChild!; // nested
    const text2 = strike1.next!;

    expect(text1.literal).toBe('Hello~~');
    expect(strike2.firstChild!.literal).toBe('World');
    expect(text2.literal).toBe('~');

    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 7]
    ]);
    expect(strike1.sourcepos).toEqual([
      [1, 8],
      [1, 20]
    ]);
    expect(strike2.sourcepos).toEqual([
      [1, 10],
      [1, 18]
    ]);
    expect(text2.sourcepos).toEqual([
      [1, 21],
      [1, 21]
    ]);

    const html = render(root);

    expect(html).toBe('<p>Hello~~<del><del>World</del></del>~</p>\n');
  });

  it('nested delimiters (with emphasis)', () => {
    const root = reader.parse('~~*Hello*~~**~~World~~**');
    const para = root.firstChild!;
    const strike1 = para.firstChild!;
    const emph = strike1.firstChild!;
    const strong = strike1.next!;
    const strike2 = strong.firstChild!;

    expect(strike1.sourcepos).toEqual([
      [1, 1],
      [1, 11]
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 3],
      [1, 9]
    ]);
    expect(strong.sourcepos).toEqual([
      [1, 12],
      [1, 24]
    ]);
    expect(strike2.sourcepos).toEqual([
      [1, 14],
      [1, 22]
    ]);

    const html = render(root);

    expect(html).toBe('<p><del><em>Hello</em></del><strong><del>World</del></strong></p>\n');
  });
});
