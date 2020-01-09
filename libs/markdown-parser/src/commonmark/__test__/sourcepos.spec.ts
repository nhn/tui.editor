import { Parser } from '../blocks';
import { BlockNode, ContainerNode, LinkNode, CodeNode, ListNode } from '../node';

const reader = new Parser();

describe('paragraph', () => {
  it('simple text', () => {
    const root = reader.parse('Hello World');
    const text = (root.firstChild! as BlockNode).firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 11]
    ]);
  });

  it('multiple offset', () => {
    const root = reader.parse('  Hello  \n  World');
    const text1 = (root.firstChild as BlockNode).firstChild!;
    const linebreak = text1.next!;
    const text2 = linebreak.next!;

    expect(text1.sourcepos).toEqual([
      [1, 3],
      [1, 7]
    ]);
    expect(linebreak.sourcepos).toEqual([
      [1, 8],
      [1, 10]
    ]);
    // preceeding whitespaces are not included in text node
    expect(text2.sourcepos).toEqual([
      [2, 3],
      [2, 7]
    ]);
  });

  it('text and emphasis', () => {
    const root = reader.parse('Hello *World*');
    const text = (root.firstChild as BlockNode).firstChild!;
    const emph = text.next as ContainerNode;
    const emphText = emph.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 7],
      [1, 13]
    ]);
    expect(emphText.sourcepos).toEqual([
      [1, 8],
      [1, 12]
    ]);
  });

  it('text and strong emphasis', () => {
    const root = reader.parse('Hello **World**');
    const text = (root.firstChild as BlockNode).firstChild!;
    const strong = text.next as ContainerNode;
    const strongText = strong.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(strong.sourcepos).toEqual([
      [1, 7],
      [1, 15]
    ]);
    expect(strongText.sourcepos).toEqual([
      [1, 9],
      [1, 13]
    ]);
  });

  it('text and image', () => {
    const root = reader.parse('Hello ![World](http://nhn.com)');
    const text = (root.firstChild as BlockNode).firstChild!;
    const image = text.next as LinkNode;
    const imageText = image.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(image.sourcepos).toEqual([
      [1, 7],
      [1, 30]
    ]);
    expect(imageText.sourcepos).toEqual([
      [1, 9],
      [1, 13]
    ]);
  });

  it('text and link', () => {
    const root = reader.parse('Hello [World](http://nhn.com)');
    const text = (root.firstChild as BlockNode).firstChild!;
    const link = text.next as LinkNode;
    const linkText = link.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(link.sourcepos).toEqual([
      [1, 7],
      [1, 29]
    ]);
    expect(linkText.sourcepos).toEqual([
      [1, 8],
      [1, 12]
    ]);
  });

  it('text and codespan', () => {
    const root = reader.parse('Hello ``World``');
    const text = (root.firstChild as BlockNode).firstChild!;
    const code = text.next as CodeNode;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(code.tickCount).toBe(2);
    expect(code.sourcepos).toEqual([
      [1, 7],
      [1, 15]
    ]);
  });

  it('text and raw html', () => {
    const root = reader.parse('Hello <strong>World</strong>');
    const text1 = (root.firstChild as BlockNode).firstChild!;
    const html1 = text1.next!;
    const text2 = html1.next!;
    const html2 = text2.next!;

    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 6]
    ]);
    expect(html1.sourcepos).toEqual([
      [1, 7],
      [1, 14]
    ]);
    expect(text2.sourcepos).toEqual([
      [1, 15],
      [1, 19]
    ]);
    expect(html2.sourcepos).toEqual([
      [1, 20],
      [1, 28]
    ]);
  });

  it('autolink', () => {
    const root = reader.parse('Hello <http://nhn.com>');
    const link = (root.firstChild as BlockNode).firstChild!.next as LinkNode;
    const linkText = link.firstChild!;

    expect(link.sourcepos).toEqual([
      [1, 7],
      [1, 22]
    ]);
    expect(linkText.sourcepos).toEqual([
      [1, 8],
      [1, 21]
    ]);
  });

  it('autolink (mailto)', () => {
    const root = reader.parse('Hello <world@nhn.com>');
    const link = (root.firstChild as BlockNode).firstChild!.next as LinkNode;
    const linkText = link.firstChild!;

    expect(link.sourcepos).toEqual([
      [1, 7],
      [1, 21]
    ]);
    expect(linkText.sourcepos).toEqual([
      [1, 8],
      [1, 20]
    ]);
  });
});

describe('softbreak and linebreak', () => {
  it('text with softbreak', () => {
    const root = reader.parse('Hello\nWorld');
    const text1 = (root.firstChild as BlockNode).firstChild!;
    const softbreak = text1.next!;
    const text2 = softbreak.next!;

    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 5]
    ]);
    expect(softbreak.type).toBe('softbreak');
    expect(softbreak.sourcepos).toEqual([
      [1, 6],
      [1, 6]
    ]);
    expect(text2.sourcepos).toEqual([
      [2, 1],
      [2, 5]
    ]);
  });

  it('text with linebreak(space)', () => {
    const root = reader.parse('Hello   \nWorld');
    const text1 = (root.firstChild as BlockNode).firstChild!;
    const linebreak = text1.next!;
    const text2 = linebreak.next!;

    // trailing spaces are not included in text node
    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 5]
    ]);
    // preceeding spaces are included in linebreak node
    expect(linebreak.sourcepos).toEqual([
      [1, 6],
      [1, 9]
    ]);
    expect(text2.sourcepos).toEqual([
      [2, 1],
      [2, 5]
    ]);
  });

  it('text with linebreak(backslash)', () => {
    const root = reader.parse('Hello\\\nWorld');
    const text1 = (root.firstChild as BlockNode).firstChild!;
    const linebreak = text1.next!;
    const text2 = linebreak.next!;

    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 5]
    ]);
    // preceeding backslash is included in linebreak node
    expect(linebreak.sourcepos).toEqual([
      [1, 6],
      [1, 7]
    ]);
    expect(text2.sourcepos).toEqual([
      [2, 1],
      [2, 5]
    ]);
  });
});

describe('atx header', () => {
  it('text and emphasis', () => {
    const root = reader.parse('# Hello *World*');
    const text = (root.firstChild as BlockNode).firstChild!;
    const emph = text.next as ContainerNode;
    const emphText = emph.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 3],
      [1, 8]
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 9],
      [1, 15]
    ]);
    expect(emphText.sourcepos).toEqual([
      [1, 10],
      [1, 14]
    ]);
  });

  it('text and emphasis (header level 3)', () => {
    const root = reader.parse('### Hello *World*');
    const text = (root.firstChild as BlockNode).firstChild!;
    const emph = text.next as ContainerNode;
    const emphText = emph.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 5],
      [1, 10]
    ]);
    expect(emph.sourcepos).toEqual([
      [1, 11],
      [1, 17]
    ]);
    expect(emphText.sourcepos).toEqual([
      [1, 12],
      [1, 16]
    ]);
  });
});

describe('list items', () => {
  it('with columns', () => {
    const root = reader.parse('   - Hello\n\n     World');
    const listItem = (root.firstChild as BlockNode).firstChild as ListNode;
    const para1 = listItem.firstChild as BlockNode;
    const para1Text = para1.firstChild!;
    const para2 = para1.next as BlockNode;
    const para2Text = para2.firstChild!;

    expect(para1Text.sourcepos).toEqual([
      [1, 6],
      [1, 10]
    ]);
    expect(para2Text.sourcepos).toEqual([
      [3, 6],
      [3, 10]
    ]);
  });
});

describe('block quote', () => {
  it('nested paragraph', () => {
    const root = reader.parse('> Hello\n> > World');
    const quote1 = root.firstChild as BlockNode;
    const para1 = quote1.firstChild as BlockNode;
    const quote2 = para1.next as BlockNode;
    const para2 = quote2.firstChild as BlockNode;

    expect(para1.firstChild!.sourcepos).toEqual([
      [1, 3],
      [1, 7]
    ]);
    expect(para2.firstChild!.sourcepos).toEqual([
      [2, 5],
      [2, 9]
    ]);
  });
});

describe('merge text nodes', () => {
  it('tokens', () => {
    const root = reader.parse(['\\ Text *', '[ Text !', '![ Text ]'].join('\n'));
    const text1 = (root.firstChild! as BlockNode).firstChild!;
    const text2 = text1.next!.next!;
    const text3 = text2.next!.next!;

    expect(text1.literal).toBe('\\ Text *');
    expect(text1.sourcepos).toEqual([
      [1, 1],
      [1, 8]
    ]);
    expect(text2.literal).toBe('[ Text !');
    expect(text2.sourcepos).toEqual([
      [2, 1],
      [2, 8]
    ]);

    expect(text3.literal).toBe('![ Text ]');
    expect(text3.sourcepos).toEqual([
      [3, 1],
      [3, 9]
    ]);
  });
});
