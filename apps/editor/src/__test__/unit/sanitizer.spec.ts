import { registerTagWhitelistIfPossible, sanitizeHTML } from '@/sanitizer/htmlSanitizer';

describe('sanitizeHTML', () => {
  it('removes unnecessary tags', () => {
    expect(sanitizeHTML('<script>alert("test");</script>')).toBe('');
    expect(sanitizeHTML('<embed type="image/jpg" src="">')).toBe('');
    expect(sanitizeHTML('<object>child die</object>')).toBe('');
    expect(sanitizeHTML('<details><summary>foo</summary></details>')).toBe('');
    expect(sanitizeHTML('<input type="image" />')).toBe('');
  });

  describe('attributes', () => {
    describe('removes attributes with invalid value including xss script', () => {
      it('table', () => {
        expect(sanitizeHTML(`<TABLE BACKGROUND="javascript:alert('XSS')">`)).toBe(
          '<table></table>'
        );
        expect(sanitizeHTML(`<TABLE><TD BACKGROUND="javascript:alert('XSS')"></TD>`)).toBe(
          '<table><tbody><tr><td></td></tr></tbody></table>'
        );
      });

      it('href attribute with a tag', () => {
        expect(sanitizeHTML('<a href="javascript:alert();">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  JaVaScRiPt: alert();">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="vbscript:alert();">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  VBscript: alert(); ">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="livescript:alert();">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML('<a href="  LIVEScript: alert() ;">xss</a>')).toBe('<a>xss</a>');
        expect(sanitizeHTML(`123<a href=' javascript:alert();'>xss</a>`)).toBe('123<a>xss</a>');
        expect(sanitizeHTML(`<a href='javas<!-- -->cript:alert()'>xss</a>`)).toBe('<a>xss</a>');
      });

      it('src attribute with img tag', () => {
        expect(sanitizeHTML('<img src="javascript:alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  JaVaScRiPt: alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="vbscript:alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  VBscript: alert(); ">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  LIVEScript: alert() ;">')).toBe('<img>');
        expect(sanitizeHTML('<img src="java<!-- -->script:alert();">')).toBe('<img>');
      });

      it('src and onerror attribute with img tag', () => {
        expect(
          sanitizeHTML('<img src = x onerror = "javascript: window.onerror = alert; throw XSS">')
        ).toBe('<img src="x">');
        expect(sanitizeHTML('"><img src="x:x" onerror="alert(XSS)">')).toBe('"&gt;<img>');
        expect(sanitizeHTML('<img src=x:alert(alt) onerror=eval(src) alt=0>')).toBe(
          '<img alt="0">'
        );
      });
    });

    describe('registerTagWhitelistIfPossible', () => {
      it('if possible, should keep the tags when registered in the white tag list', () => {
        registerTagWhitelistIfPossible('embed');
        registerTagWhitelistIfPossible('iframe');

        expect(sanitizeHTML('<iframe src=""></iframe>')).toBe('<iframe src=""></iframe>');
        expect(sanitizeHTML('<embed type="image/jpg" src="">')).toBe(
          '<embed type="image/jpg" src="">'
        );
      });

      it('should remove the tags in case that the tag name cannot be white list', () => {
        registerTagWhitelistIfPossible('sript');
        registerTagWhitelistIfPossible('input');

        expect(sanitizeHTML('<script>alert("test");</script>')).toBe('');
        expect(sanitizeHTML('<input type="image" />')).toBe('');
      });
    });
  });
});
