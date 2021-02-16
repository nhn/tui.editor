import { Parser } from '../../blocks';
import { Renderer } from '../../../html/render';
import { CustomInlineNode } from '../../../commonmark/node';

const reader = new Parser();
const renderer = new Renderer();

describe('customInline', () => {
  it('basic example', () => {
    const root = reader.parse('Hello $$myInline World$$');
    const para = root.firstChild!;
    const text = para.firstChild!;
    const customInline = text.next as CustomInlineNode;
    const inlineText = customInline.firstChild!;

    expect(text.literal).toBe('Hello ');
    expect(inlineText.literal).toBe('World');
    expect(customInline.info).toBe('myInline');
    expect(customInline.sourcepos).toEqual([
      [1, 7],
      [1, 24]
    ]);
    expect(inlineText.sourcepos).toEqual([
      [1, 17],
      [1, 22]
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello <span>World</span></p>\n');
  });

  it('nested markdown text example', () => {
    const root = reader.parse('Hello $$myInline *World*$$');
    const para = root.firstChild!;
    const text = para.firstChild!;
    const customInline = text.next as CustomInlineNode;
    const emph = customInline.firstChild!;

    expect(text.literal).toBe('Hello ');
    expect(customInline.info).toBe('myInline');
    expect(customInline.sourcepos).toEqual([
      [1, 7],
      [1, 26]
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 18],
      [1, 24]
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello <span><em>World</em></span></p>\n');
  });
});
