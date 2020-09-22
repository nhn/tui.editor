import { Parser } from '../../blocks';
import { createRenderHTML } from '../../../html/render';
import { LinkNode } from '../../node';
import { pos } from '../../__test__/helper.spec';
import { parseUrlLink, parseEmailLink } from '../autoLinks';

describe('parseUrlLink()', () => {
  // https://github.github.com/gfm/#extended-www-autolink
  // https://github.github.com/gfm/#extended-url-autolink
  it('domain not preceeded by www is invalid', () => {
    expect(parseUrlLink('nhn.com')).toEqual([]);
    expect(parseUrlLink('ui.toast.com')).toEqual([]);
  });

  it('domain preceeded by www with less than 2 periods(.) is invalid', () => {
    expect(parseUrlLink('www.nhn')).toEqual([]);
  });

  it('domain preceeded by www is valid', () => {
    expect(parseUrlLink('www.nhn.com')).toEqual([
      {
        text: 'www.nhn.com',
        url: `http://www.nhn.com`,
        range: [0, 10]
      }
    ]);

    expect(parseUrlLink('Visit www.nhn.com Now!')).toEqual([
      {
        text: 'www.nhn.com',
        url: `http://www.nhn.com`,
        range: [6, 16]
      }
    ]);
  });

  it('domain preceeded by http(s):// is valid', () => {
    expect(parseUrlLink('http://nhn.com')).toEqual([
      {
        text: 'http://nhn.com',
        url: `http://nhn.com`,
        range: [0, 13]
      }
    ]);

    expect(parseUrlLink('https://nhn.com')).toEqual([
      {
        text: 'https://nhn.com',
        url: `https://nhn.com`,
        range: [0, 14]
      }
    ]);
  });

  it('zero or more non-space non-< characters may follow', () => {
    expect(parseUrlLink('www.nhn.com/help<me')).toEqual([
      {
        text: 'www.nhn.com/help',
        url: `http://www.nhn.com/help`,
        range: [0, 15]
      }
    ]);
  });

  it('tailing punctuation (?!,.:*_~) is not considered part of the link', () => {
    const pairs = [
      ['www.nhn.com/?help?', 'www.nhn.com/?help'],
      ['www.nhn.com/!help!', 'www.nhn.com/!help'],
      ['www.nhn.com/,help,', 'www.nhn.com/,help'],
      ['www.nhn.com/.help.', 'www.nhn.com/.help'],
      ['www.nhn.com/:help:', 'www.nhn.com/:help'],
      ['www.nhn.com/*help*', 'www.nhn.com/*help'],
      ['www.nhn.com/~help~', 'www.nhn.com/~help'],
      ['http://nhn.com/~help~', 'http://nhn.com/~help'],
      ['https://nhn.com/~help~', 'https://nhn.com/~help']
    ];

    pairs.forEach(([input, text]) => {
      expect(parseUrlLink(input)![0].text).toBe(text);
    });
  });

  it('trailing closing parens without matching opening parens are excluded', () => {
    const pairs = [
      ['www.nhn.com/(ui)', 'www.nhn.com/(ui)'],
      ['www.nhn.com/(ui))', 'www.nhn.com/(ui)'],
      ['(www.nhn.com/(ui))', 'www.nhn.com/(ui)'],
      ['(www.nhn.com/((ui))', 'www.nhn.com/((ui))'],
      ['(www.nhn.com/(ui)', 'www.nhn.com/(ui)'],
      ['(www.nhn.com/)))(ui))', 'www.nhn.com/)))(ui)'],
      ['(http://nhn.com/)))(ui))', 'http://nhn.com/)))(ui)'],
      ['(https://nhn.com/)))(ui))', 'https://nhn.com/)))(ui)']
    ];

    pairs.forEach(([input, text]) => {
      expect(parseUrlLink(input)![0].text).toBe(text);
    });
  });

  it('trailing entity-like pattern (&xxx;) are excluded', () => {
    const pairs = [
      ['www.nhn.com/ui&editor;grid', 'www.nhn.com/ui&editor;grid'],
      ['www.nhn.com/ui&grid;', 'www.nhn.com/ui'],
      ['www.nhn.com/ui&?grid;', 'www.nhn.com/ui&?grid;'],
      ['http://nhn.com/ui&?grid;', 'http://nhn.com/ui&?grid;'],
      ['https://nhn.com/ui&?grid;', 'https://nhn.com/ui&?grid;']
    ];

    pairs.forEach(([input, text]) => {
      expect(parseUrlLink(input)![0].text).toBe(text);
    });
  });

  it('should handle multiple occurrences', () => {
    expect(parseUrlLink('Hello www.nhn.com and http://toast.com')).toEqual([
      {
        text: 'www.nhn.com',
        url: 'http://www.nhn.com',
        range: [6, 16]
      },
      {
        text: 'http://toast.com',
        url: 'http://toast.com',
        range: [22, 37]
      }
    ]);
  });
});

describe('parseEmailLink', () => {
  it('simple example', () => {
    expect(parseEmailLink('ui@toast.com')).toEqual([
      {
        text: 'ui@toast.com',
        url: 'mailto:ui@toast.com',
        range: [0, 11]
      }
    ]);

    expect(parseEmailLink('Hello ui@toast.com guys')).toEqual([
      {
        text: 'ui@toast.com',
        url: 'mailto:ui@toast.com',
        range: [6, 17]
      }
    ]);
  });

  it('+ can occur before the @, but not after.', () => {
    expect(parseEmailLink('ui@to+ast.com')).toEqual([]);
    expect(parseEmailLink('u+i@toast.com')).toEqual([
      {
        text: 'u+i@toast.com',
        url: 'mailto:u+i@toast.com',
        range: [0, 12]
      }
    ]);
  });

  it('trailing dash(-) and underscore(_) are invalid, trailing dot(.) is excluded ', () => {
    const pairs = [
      ['a.b-c_d@a.b', 'a.b-c_d@a.b'],
      ['a.b-c_d@a.b.', 'a.b-c_d@a.b']
    ];
    const invalids = ['a.b-c_d@a.b-', 'a.b-c_d@a.b_'];

    pairs.forEach(([input, text]) => {
      expect(parseEmailLink(input)![0].text).toBe(text);
    });
    invalids.forEach(input => {
      expect(parseEmailLink(input)).toEqual([]);
    });
  });

  it('should handle multiple occurrences', () => {
    expect(parseEmailLink('Hello ui@toast.com and file@toast.com')).toEqual([
      {
        text: 'ui@toast.com',
        url: 'mailto:ui@toast.com',
        range: [6, 17]
      },
      {
        text: 'file@toast.com',
        url: 'mailto:file@toast.com',
        range: [23, 36]
      }
    ]);
  });
});

describe('custom autolink parser', () => {
  const render = createRenderHTML();
  const reader = new Parser({
    extendedAutolinks: content => {
      const regex = /\d{3}/g;
      const result = [];
      let matched;

      while ((matched = regex.exec(content))) {
        const { index } = matched;
        const text = matched[0];
        const range: [number, number] = [index, index + text.length - 1];
        const url = `num:${text}`;

        result.push({ text, url, range });
      }
      return result;
    }
  });

  it('should parse custom pattern', () => {
    const root = reader.parse('A 111 B 222');
    const para = root.firstChild!;
    const link1 = para.firstChild!.next!;
    const link2 = link1.next!.next!;

    expect(link1).toMatchObject({
      destination: 'num:111',
      extendedAutolink: true,
      sourcepos: pos(1, 3, 1, 5),
      firstChild: {
        literal: '111'
      }
    });

    expect(link2).toMatchObject({
      destination: 'num:222',
      extendedAutolink: true,
      sourcepos: pos(1, 9, 1, 11),
      firstChild: {
        literal: '222'
      }
    });

    expect(render(root)).toBe('<p>A <a href="num:111">111</a> B <a href="num:222">222</a></p>\n');
  });
});

// https://github.github.com/gfm/#example-621
describe('GFM Examples', () => {
  const reader = new Parser({ extendedAutolinks: true });
  const render = createRenderHTML();

  it('621', () => {
    const root = reader.parse('www.commonmark.org');
    const link = root.firstChild!.firstChild as LinkNode;
    const linkText = link.firstChild!;

    expect(link).toMatchObject({
      type: 'link',
      destination: 'http://www.commonmark.org',
      extendedAutolink: true,
      sourcepos: pos(1, 1, 1, 18)
    });

    expect(linkText).toMatchObject({
      literal: 'www.commonmark.org',
      sourcepos: pos(1, 1, 1, 18)
    });

    const html = render(root);
    expect(html).toBe('<p><a href="http://www.commonmark.org">www.commonmark.org</a></p>\n');
  });

  it('622', () => {
    const root = reader.parse('Visit www.commonmark.org/help for more information.');
    const text1 = root.firstChild!.firstChild!;
    const link = text1.next as LinkNode;
    const linkText = link.firstChild!;
    const text2 = link.next!;

    expect(text1.literal).toBe('Visit ');
    expect(link).toMatchObject({
      type: 'link',
      extendedAutolink: true,
      destination: 'http://www.commonmark.org/help',
      sourcepos: pos(1, 7, 1, 29)
    });

    expect(linkText.literal).toBe('www.commonmark.org/help');
    expect(linkText.sourcepos).toEqual(pos(1, 7, 1, 29));

    expect(text2.literal).toBe(' for more information.');
    expect(text2.sourcepos).toEqual(pos(1, 30, 1, 51));

    const html = render(root);
    expect(html).toBe(
      '<p>Visit <a href="http://www.commonmark.org/help">www.commonmark.org/help</a> for more information.</p>\n'
    );
  });

  const examples = [
    {
      no: 623,
      input: ['Visit www.commonmark.org.\n\n', 'Visit www.commonmark.org/a.b.'].join(''),
      output: [
        '<p>Visit <a href="http://www.commonmark.org">www.commonmark.org</a>.</p>\n',
        '<p>Visit <a href="http://www.commonmark.org/a.b">www.commonmark.org/a.b</a>.</p>\n'
      ].join('')
    },
    {
      no: 624,
      input: [
        'www.google.com/search?q=Markup+(business)\n\n',
        'www.google.com/search?q=Markup+(business)))\n\n',
        '(www.google.com/search?q=Markup+(business))\n\n',
        '(www.google.com/search?q=Markup+(business)'
      ].join(''),
      output: [
        '<p><a href="http://www.google.com/search?q=Markup+(business)">',
        'www.google.com/search?q=Markup+(business)</a></p>\n',
        '<p><a href="http://www.google.com/search?q=Markup+(business)">',
        'www.google.com/search?q=Markup+(business)</a>))</p>\n',
        '<p>(<a href="http://www.google.com/search?q=Markup+(business)">',
        'www.google.com/search?q=Markup+(business)</a>)</p>\n',
        '<p>(<a href="http://www.google.com/search?q=Markup+(business)">',
        'www.google.com/search?q=Markup+(business)</a></p>\n'
      ].join('')
    },
    {
      no: 625,
      input: 'www.google.com/search?q=(business))+ok',
      output: [
        '<p><a href="http://www.google.com/search?q=(business))+ok">',
        'www.google.com/search?q=(business))+ok</a></p>\n'
      ].join('')
    },
    {
      no: 626,
      input: [
        'www.google.com/search?q=commonmark&hl=en\n\n',
        'www.google.com/search?q=commonmark&hl;'
      ].join(''),
      output: [
        '<p><a href="http://www.google.com/search?q=commonmark&amp;hl=en">',
        'www.google.com/search?q=commonmark&amp;hl=en</a></p>\n',
        '<p><a href="http://www.google.com/search?q=commonmark">',
        'www.google.com/search?q=commonmark</a>&amp;hl;</p>\n'
      ].join('')
    },
    {
      no: 627,
      input: 'www.commonmark.org/he<lp',
      output: '<p><a href="http://www.commonmark.org/he">www.commonmark.org/he</a>&lt;lp</p>\n'
    },
    {
      no: 628,
      input: [
        'http://commonmark.org\n\n',
        '(Visit https://encrypted.google.com/search?q=Markup+(business))'
      ].join(''),
      output: [
        '<p><a href="http://commonmark.org">http://commonmark.org</a></p>\n',
        '<p>(Visit <a href="https://encrypted.google.com/search?q=Markup+(business)">',
        'https://encrypted.google.com/search?q=Markup+(business)</a>)</p>\n'
      ].join('')
    },
    {
      no: 629,
      input: 'foo@bar.baz',
      output: '<p><a href="mailto:foo@bar.baz">foo@bar.baz</a></p>\n'
    },
    {
      no: 630,
      input: `hello@mail+xyz.example isn't valid, but hello+xyz@mail.example is.`,
      output: [
        `<p>hello@mail+xyz.example isn't valid, but `,
        `<a href="mailto:hello+xyz@mail.example">hello+xyz@mail.example</a> is.</p>\n`
      ].join('')
    },
    {
      no: 631,
      input: ['a.b-c_d@a.b\n\n', 'a.b-c_d@a.b.\n\n', 'a.b-c_d@a.b-\n\n', 'a.b-c_d@a.b_'].join(''),
      output: [
        '<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a></p>\n',
        '<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a>.</p>\n',
        '<p>a.b-c_d@a.b-</p>\n',
        '<p>a.b-c_d@a.b_</p>\n'
      ].join('')
    }
  ];

  examples.forEach(({ no, input, output }) => {
    it(String(no), () => {
      const root = reader.parse(input);
      const html = render(root);
      expect(html).toBe(output);
    });
  });
});
