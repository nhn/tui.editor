import { sanitizeHTML } from '@/sanitizer/htmlSanitizer';

describe('sanitizeHTML', () => {
  it('removes unnecessary tags', () => {
    expect(sanitizeHTML('<script>alert("test");</script>', true)).toBe('');
    expect(sanitizeHTML('<embed>child alive</embed>', true)).toBe('child alive');
    expect(sanitizeHTML('<object>child die</object>', true)).toBe('');
    expect(sanitizeHTML('<details><summary>foo</summary></details>', true)).toBe('');
    expect(sanitizeHTML('<input type="image" />', true)).toBe('');
  });

  describe('attributes', () => {
    it('removes all attribute but white list', () => {
      const html =
        '<img style="display:inline" class="V" title="V" data-custom="V" src="http://www.nhn.com/renewal/img/ci_nhn.png" onload="dd=1" onerror="javascript:alert();"/>';

      const dom = sanitizeHTML(html);
      const img = (dom as DocumentFragment).querySelector('img');

      expect(img).toHaveAttribute('src');
      expect(img).toHaveAttribute('class');
      expect(img).toHaveAttribute('title');
      expect(img).toHaveAttribute('style');
      expect(img).toHaveAttribute('data-custom');

      expect(img).not.toHaveAttribute('onload');
      expect(img).not.toHaveAttribute('onerror');
    });

    it('leaves svg attributes', () => {
      const html =
        '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';

      const dom = sanitizeHTML(html);
      const circle = (dom as DocumentFragment).querySelector('circle');

      expect(circle).toHaveAttribute('cx');
      expect(circle).toHaveAttribute('cy');
      expect(circle).toHaveAttribute('r');
      expect(circle).toHaveAttribute('stroke');
      expect(circle).toHaveAttribute('stroke-width');
      expect(circle).toHaveAttribute('fill');
    });

    describe('removes attributes with invalid value including xss script', () => {
      it('table', () => {
        expect(sanitizeHTML(`<TABLE BACKGROUND="javascript:alert('XSS')">`, true)).toBe(
          '<table></table>'
        );
        expect(sanitizeHTML(`<TABLE><TD BACKGROUND="javascript:alert('XSS')"></TD>`, true)).toBe(
          '<table><tbody><tr><td></td></tr></tbody></table>'
        );
      });

      it('href attribute with a tag', () => {
        expect(sanitizeHTML('<a href="javascript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  JaVaScRiPt: alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="vbscript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  VBscript: alert(); ">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="livescript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  LIVEScript: alert() ;">xss</a>', true)).toBe('<a>xss</a>');
        expect(sanitizeHTML(`123<a href=' javascript:alert();'>xss</a>`, true)).toBe(
          '123<a>xss</a>'
        );
        expect(sanitizeHTML(`<a href='javas<!-- -->cript:alert()'>xss</a>`, true)).toBe(
          '<a>xss</a>'
        );
      });

      it('src attribute with img tag', () => {
        expect(sanitizeHTML('<img src="javascript:alert();">', true)).toBe('<img>');
        expect(sanitizeHTML('<img src="  JaVaScRiPt: alert();">', true)).toBe('<img>');
        expect(sanitizeHTML('<img src="vbscript:alert();">', true)).toBe('<img>');
        expect(sanitizeHTML('<img src="  VBscript: alert(); ">', true)).toBe('<img>');
        expect(sanitizeHTML('<img src="  LIVEScript: alert() ;">', true)).toBe('<img>');
        expect(sanitizeHTML('<img src="java<!-- -->script:alert();">', true)).toBe('<img>');
      });

      it('src and onerror attribute with img tag', () => {
        expect(
          sanitizeHTML(
            '<img src = x onerror = "javascript: window.onerror = alert; throw XSS">',
            true
          )
        ).toBe('<img src="x">');
        expect(sanitizeHTML('"><img src="x:x" onerror="alert(XSS)">', true)).toBe('"&gt;<img>');
        expect(sanitizeHTML('<img src=x:alert(alt) onerror=eval(src) alt=0>', true)).toBe(
          '<img alt="0">'
        );
      });
    });
  });
});
