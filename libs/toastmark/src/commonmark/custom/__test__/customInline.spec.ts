import { Parser } from '../../blocks';
import { Renderer } from '../../../html/renderer';
import { CustomInlineNode } from '../../node';

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
      [1, 24],
    ]);
    expect(inlineText.sourcepos).toEqual([
      [1, 17],
      [1, 22],
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello <span>$$myInline World$$</span></p>\n');
  });

  it('nested markdown text example', () => {
    const root = reader.parse('Hello $$myInline *World*$$');
    const para = root.firstChild!;
    const text = para.firstChild!;
    const customInline = text.next as CustomInlineNode;
    const emph = customInline.lastChild!;

    expect(text.literal).toBe('Hello ');
    expect(customInline.info).toBe('myInline');
    expect(customInline.sourcepos).toEqual([
      [1, 7],
      [1, 26],
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 18],
      [1, 24],
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello <span>$$myInline <em>World</em>$$</span></p>\n');
  });

  it('should be parsed as text without meta information', () => {
    const root = reader.parse('Hello $$ world$$');
    const para = root.firstChild!;
    const text = para.firstChild!;

    expect(text.literal).toBe('Hello $$ world$$');
    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 16],
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello $$ world$$</p>\n');
  });

  it('should be render properly with meta information only', () => {
    const root = reader.parse('Hello $$myInline$$');
    const para = root.firstChild!;
    const text = para.firstChild!;
    const customInline = text.next as CustomInlineNode;

    expect(text.literal).toBe('Hello ');
    expect(customInline.info).toBe('myInline');
    expect(customInline.sourcepos).toEqual([
      [1, 7],
      [1, 18],
    ]);

    const html = renderer.render(root);

    expect(html).toBe('<p>Hello <span>$$myInline$$</span></p>\n');
  });
});
