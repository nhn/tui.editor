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

describe('inside header', () => {
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

  it('text and emphasis (header level 3)', () => {
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
