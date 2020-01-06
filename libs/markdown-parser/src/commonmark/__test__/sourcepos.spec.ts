import { Parser } from '../blocks';

const reader = new Parser();

describe('paragraph', () => {
  it('simple text', () => {
    const root = reader.parse('Hello World');
    const text = root.firstChild!.firstChild!;

    expect(text.sourcepos).toEqual([
      [1, 1],
      [1, 11]
    ]);
  });

  it('multiple offset', () => {
    const root = reader.parse('  Hello  \n  World');
    const text1 = root.firstChild!.firstChild!;
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
    const text = root.firstChild!.firstChild!;
    const emph = text.next!;
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
    const text = root.firstChild!.firstChild!;
    const strong = text.next!;
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
});

describe('softbreak and linebreak', () => {
  it('text with softbreak', () => {
    const root = reader.parse('Hello\nWorld');
    const text1 = root.firstChild!.firstChild!;
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
    const text1 = root.firstChild!.firstChild!;
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
    const text1 = root.firstChild!.firstChild!;
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

describe('header', () => {
  it('text and emphasis', () => {
    const root = reader.parse('# Hello *World*');
    const text = root.firstChild!.firstChild!;
    const emph = text.next!;
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

  it.only('text and emphasis (header level 3)', () => {
    const root = reader.parse('### Hello *World*');
    const text = root.firstChild!.firstChild!;
    const emph = text.next!;
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

describe('link and image', () => {
  it.only('image', () => {
    const root = reader.parse('Hello ![World](http://nhn.com)');
    const text = root.firstChild!.firstChild!;
    const image = text.next!;
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

  it('link', () => {
    const root = reader.parse('Hello [World](http://nhn.com)');
    const text = root.firstChild!.firstChild!;
    const link = text.next!;
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
});
