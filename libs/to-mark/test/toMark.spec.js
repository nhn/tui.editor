import toMark from '@/toMark';

describe('toMark', () => {
  it("do not convert markdown syntax when passed element has 'data-tomark-pass' attribute", () => {
    expect(toMark('<br data-tomark-pass>')).toEqual('<br>');
    expect(toMark('<div data-tomark-pass>hello</div>')).toEqual('<div>hello</div>');
    expect(toMark('<span data-tomark-pass>world</span>')).toEqual('<span>world</span>');
  });

  it("child elements of an element which has 'data-tomark-pass' should be converted", () => {
    expect(toMark('<b data-tomark-pass>Hello <s>World</s></b>')).toBe('<b>Hello ~~World~~</b>');
    expect(toMark('<b class="custom" data-tomark-pass>Hello <s>World</s></b>')).toBe(
      '<b class="custom">Hello ~~World~~</b>'
    );
  });

  it('if pass empty string or falsy object return empty string', () => {
    expect(toMark('')).toEqual('');
    expect(toMark(false)).toEqual('');
    expect(toMark()).toEqual('');
    expect(toMark(null)).toEqual('');
  });

  it('should escape vertical bars', () => {
    expect(toMark('<div>1 | Introduction</div>')).toEqual('<div>1 \\| Introduction</div>');
    expect(toMark('<p>|||. Exercise</p>')).toEqual('\\|\\|\\|\\. Exercise');
    expect(toMark('<b>|go ro Work|</b>')).toEqual('**\\|go ro Work\\|**');
  });

  it('should escape [, ] inside link syntax', () => {
    expect(toMark('<a href="url">text[</a>')).toEqual('[text\\[](url)');
    expect(toMark('<a href="url">text]</a>')).toEqual('[text\\]](url)');
    expect(toMark('<a href="url">[text]</a>')).toEqual('[\\[text\\]](url)');
  });

  it('should not escape image syntax inside link syntax', () => {
    expect(toMark('<a href="url"><img src="src" alt="alt" /></a>')).toEqual('[![alt](src)](url)');
    expect(
      toMark('<a href="url"><img src="src" alt="alt" /><img src="src2" alt="alt2" /></a>')
    ).toEqual('[![alt](src)![alt2](src2)](url)');
    expect(
      toMark('<a href="url"><img src="src" alt="alt" />Text<img src="src2" alt="alt2" /></a>')
    ).toEqual('[![alt](src)Text![alt2](src2)](url)');
  });

  it("markdown text's EOL FOL newline characters should be removed", () => {
    expect(toMark('<h1>Hello World</h1>')).toEqual('# Hello World');
    expect(toMark('<h1>Hello World</h1><br />')).toEqual('# Hello World');
  });

  it('Empty spaces more than 1 are removed even if flanked space in tags', () => {
    expect(toMark('<h2>Hello <em> World</em></h2>')).toEqual('## Hello *World*');
    expect(toMark('<h2>Hello  <em>World</em></h2>')).toEqual('## Hello *World*');
    expect(toMark('<h2>Hello  <em>World </em></h2>')).toEqual('## Hello *World*');
    expect(toMark('<h2><em>Hello</em> <em>World</em></h2>')).toEqual('## *Hello* *World*');
    expect(toMark('<h2><em>Hello</em> World</h2>')).toEqual('## *Hello* World');
    expect(toMark('<h2><em>Hello </em> World</h2>')).toEqual('## *Hello* World');
    expect(toMark('<h2><em>Hello </em>World</h2>')).toEqual('## *Hello* World');
    expect(toMark('<h2><em>Hello</em>  &nbsp;&nbsp;World</h2>')).toEqual(
      '## *Hello* \u00a0\u00a0World'
    );
    expect(toMark('<h2><em>Hello&nbsp;</em>  &nbsp;&nbsp;World</h2>')).toEqual(
      '## *Hello\u00a0* \u00a0\u00a0World'
    );
  });

  it('p and inlines', () => {
    expect(toMark('<p>this is link <a href="http://nhnent.com">link</a></p>')).toEqual(
      'this is link [link](http://nhnent.com)'
    );
    expect(toMark('<p><em>this</em> is link <a href="http://nhnent.com">link</a></p>')).toEqual(
      '*this* is link [link](http://nhnent.com)'
    );
    expect(toMark('<p><em>this</em> is &nbsp;<strong>strong</strong></p>')).toEqual(
      '*this* is \u00a0**strong**'
    );
  });

  it('pass gfm false option to using basic markdown renderer', () => {
    expect(
      toMark('<del>strike</del>', {
        gfm: false
      }).toLowerCase()
    ).toEqual('<del>strike</del>');

    expect(toMark('<del>strike</del>')).toEqual('~~strike~~');
  });

  it('collapse triple returns made by consecutive block element', () => {
    expect(toMark('<p>text</p><p>text</p>')).toEqual('text\n\ntext');
  });

  describe('finalize markdown text', () => {
    it('process br', () => {
      expect(toMark('<p>text1<br /></p><p>text</p>', { gfm: false })).toEqual('text1\n\ntext');
      expect(toMark('<p>text2<br />text<br /></p><p>text</p>', { gfm: false })).toEqual(
        'text2  \ntext\n\ntext'
      );
      expect(toMark('<p>text3<br />text  &nbsp;<br /></p><p>text</p>', { gfm: false })).toEqual(
        'text3  \ntext\n\ntext'
      );
      // 블럭태그와 블럭태그 사이는 최대 한칸
      expect(toMark('<p>text4<br /></p><br /><p>text</p>', { gfm: false })).toEqual(
        'text4\n\ntext'
      );
      // 블럭태그와 블럭태그 사이는 최대 한칸
      expect(toMark('<p>text5<br /></p><br /><p>text</p>')).toEqual('text5\n\ntext');
      // 두개이상의 BR은 개행한개로
      expect(toMark('text6<br /><br /><br /><br />text')).toEqual('text6\n\ntext');
    });

    it('returns between block tags', () => {
      expect(toMark('<ul><li>text1<br></li><li>text1<br></li></ul>', { gfm: false })).toEqual(
        '* text1\n* text1'
      );
      expect(
        toMark('<ul><li>text2<br><ul><li>text2<br>text2</li><li>text2<br></li></ul></li></ul>', {
          gfm: false
        })
      ).toEqual('* text2\n    * text2  \n    text2\n    * text2');
      expect(
        toMark('<ul><li>text<br><ul><li>text<br></li><li>text<br></li></ul></li></ul>', {
          gfm: false
        })
      ).toEqual('* text\n    * text\n    * text');
      expect(toMark('<ul><li>text4<br></li></ul><p>text4</p>', { gfm: false })).toEqual(
        '* text4\n\ntext4'
      );
      expect(
        toMark('<ul><li>text5<br></li></ul><p>text5<br>text5<br></p>', { gfm: false })
      ).toEqual('* text5\n\ntext5  \ntext5');
      expect(toMark('<ul><li>text<br></li></ul><p>text<br>text</p>')).toEqual(
        '* text\n\ntext\ntext'
      );
      expect(toMark('<ul><li>text</li></ul><p></p><ul><li>text</li></ul>', { gfm: false })).toEqual(
        '* text\n\n* text'
      );
    });

    it('list', () => {
      expect(
        toMark(
          '<ul><li>text<br><ul><li>text<br></li><li>text<br></li></ul></li><li>text3</li></ul>'
        )
      ).toEqual('* text\n    * text\n    * text\n* text3');
    });

    it('text and block tags', () => {
      expect(toMark('text1<br><ul><li>text2<br></li></ul>')).toEqual('text1\n\n* text2');
    });

    it('process empty multi line', () => {
      expect(toMark('<p>text1<br /><br /><br />text</p>')).toEqual('text1\ntext');
      expect(toMark('<p>text2<br /><br />text</p>')).toEqual('text2\ntext');
      expect(toMark('<p>text3</p><br /><br /><p>text</p>')).toEqual('text3\n\ntext');
    });
  });
});
