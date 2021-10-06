import { registerTagWhitelistIfPossible, sanitizeHTML } from '@/sanitizer/htmlSanitizer';

describe('sanitizeHTML', () => {
  it('removes unnecessary tags', () => {
    expect(sanitizeHTML('<script>alert("test");</script>')).toBe('');
    expect(sanitizeHTML('<embed type="image/jpg" src="">')).toBe('');
    expect(sanitizeHTML('<object>child die</object>')).toBe('child die');
    expect(sanitizeHTML('<input type="image" />')).toBe('');
    expect(sanitizeHTML('<base href=https://avocadot0ast.free.beeceptor.com>')).toBe('');
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
        expect(sanitizeHTML(`<a href='javas cript:alert()'>xss</a>`)).toBe('<a>xss</a>');
      });

      it('src attribute with img tag', () => {
        expect(sanitizeHTML('<img src="javascript:alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  JaVaScRiPt: alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="vbscript:alert();">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  VBscript: alert(); ">')).toBe('<img>');
        expect(sanitizeHTML('<img src="  LIVEScript: alert() ;">')).toBe('<img>');
        expect(sanitizeHTML('<img src="java script:alert();">')).toBe('<img>');
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

      it('should remove onload attribute in svg', () => {
        expect(sanitizeHTML('<svg><svg onload=alert(111)> </svg></svg>')).toBe(
          '<svg><svg> </svg></svg>'
        );
        expect(sanitizeHTML('<svg><svg onLOad=alert(111)> </svg></svg>')).toBe(
          '<svg><svg> </svg></svg>'
        );
        expect(sanitizeHTML('<svg><svg onLOad="alert(111)"> </svg></svg>')).toBe(
          '<svg><svg> </svg></svg>'
        );
        expect(sanitizeHTML(`<svg><svg onLOad='alert(111)'> </svg></svg>`)).toBe(
          '<svg><svg> </svg></svg>'
        );
        expect(sanitizeHTML('<svg><svg onload=alert(1) onload=alert(2)>')).toBe(
          '<svg><svg></svg></svg>'
        );
        expect(sanitizeHTML('<svg><svg x=">" onload=alert(1)>')).toBe(
          '<svg><svg x=">"></svg></svg>'
        );
        expect(sanitizeHTML('<p><svg><svg onload=onload=alert(1)></svg></svg></p>')).toBe(
          '<p><svg><svg></svg></svg></p>'
        );
      });

      it('should remove <use> tag and href attribute in svg', () => {
        expect(
          sanitizeHTML(
            '<svg><use href="data:image/svg+xml;base64,PHN2ZyBpZD0neCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyAKICAgIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzEwMCc+PGEgeGxpbms6aHJlZj0namF2YXNjcmlwdDphbGVydCgxKSc+PHJlY3QgeD0nMCcgeT0nMCcgd2lkdGg9JzEwMCcgaGVpZ2h0PScxMDAnIC8+PC9hPjwvc3ZnPg#x"></use></svg>'
          )
        ).toBe('<svg></svg>');
        expect(
          sanitizeHTML(
            `<svg><use href="data:image/svg+xml;charset=ISO-2022-JP,<svg id='x' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='100' height='100'><a xlink:href='javas%1B%28Bcript:alert(1)'><rect x='0' y='0' width='100' height='100' /></a></svg>#x"></use></svg>`
          )
        ).toBe('<svg></svg>');
      });

      it('should remove ontoggle attribute in details', () => {
        expect(sanitizeHTML('<details open ontoggle=alert(1)>')).toBe(
          '<details open=""></details>'
        );
      });
    });

    describe('registerTagWhitelistIfPossible', () => {
      it('if possible, should keep the tags when registered in the white tag list', () => {
        registerTagWhitelistIfPossible('embed');
        registerTagWhitelistIfPossible('iframe');

        expect(sanitizeHTML('<iframe src=""></iframe>')).toBe('<iframe src=""></iframe>');
        expect(sanitizeHTML('<embed type="image/jpg" src="">')).toBe(
          '<embed src="" type="image/jpg">'
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
