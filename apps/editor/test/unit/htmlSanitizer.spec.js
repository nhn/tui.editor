/**
 * @fileoverview test html sanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import htmlSanitizer from '@/htmlSanitizer';

describe('htmlSanitizer', function() {
  describe('tags', function() {
    it('removes unnecessary tags', function() {
      expect(htmlSanitizer('<script>alert("test");</script>', true)).toBe('');
      expect(htmlSanitizer('<embed>child alive</embed>', true)).toBe('child alive');
      expect(htmlSanitizer('<object>child die</object>', true)).toBe('');
      expect(htmlSanitizer('<details><summary>foo</summary></details>', true)).toBe('');
      expect(htmlSanitizer('<input type="image" />', true)).toBe('');
    });
  });

  describe('attributes', () => {
    it('removes all attritube but white list', () => {
      const html =
        '<img style="display:inline" class="V" title="V" data-custom="V" src="http://www.nhn.com/renewal/img/ci_nhn.png" onload="dd=1" onerror="javascript:alert();"/>';
      const dom = htmlSanitizer(html);

      const $img = $(dom).find('img');

      expect($img.attr('src')).toBeTruthy();
      expect($img.attr('class')).toBeTruthy();
      expect($img.attr('title')).toBeTruthy();
      expect($img.attr('style')).toBeTruthy();
      expect($img.attr('data-custom')).toBeTruthy();

      expect($img.attr('onload')).not.toBeDefined();
      expect($img.attr('onerror')).not.toBeDefined();
    });

    it('leaves svg attributes', () => {
      const html =
        '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';
      const dom = htmlSanitizer(html);
      const $circle = $(dom).find('circle');

      expect($circle.attr('cx')).toBeTruthy();
      expect($circle.attr('cy')).toBeTruthy();
      expect($circle.attr('r')).toBeTruthy();
      expect($circle.attr('stroke')).toBeTruthy();
      expect($circle.attr('stroke-width')).toBeTruthy();
      expect($circle.attr('fill')).toBeTruthy();
    });

    describe('removes attributes with invalid value including xss script', () => {
      it('table', () => {
        expect(htmlSanitizer(`<TABLE BACKGROUND="javascript:alert('XSS')">`, true)).toBe(
          '<table></table>'
        );
        expect(htmlSanitizer(`<TABLE><TD BACKGROUND="javascript:alert('XSS')"></TD>`, true)).toBe(
          '<table><tbody><tr><td></td></tr></tbody></table>'
        );
      });

      it('href attribute with a tag', () => {
        expect(htmlSanitizer('<a href="javascript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer('<a href="  JaVaScRiPt: alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer('<a href="vbscript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer('<a href="  VBscript: alert(); ">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer('<a href="livescript:alert();">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer('<a href="  LIVEScript: alert() ;">xss</a>', true)).toBe('<a>xss</a>');
        expect(htmlSanitizer(`123<a href=' javascript:alert();'>xss</a>`, true)).toBe(
          '123<a>xss</a>'
        );
        expect(htmlSanitizer(`<a href='javas<!-- -->cript:alert()'>xss</a>`, true)).toBe(
          '<a>xss</a>'
        );
      });

      it('src attribute with img tag', () => {
        expect(htmlSanitizer('<img src="javascript:alert();">', true)).toBe('<img>');
        expect(htmlSanitizer('<img src="  JaVaScRiPt: alert();">', true)).toBe('<img>');
        expect(htmlSanitizer('<img src="vbscript:alert();">', true)).toBe('<img>');
        expect(htmlSanitizer('<img src="  VBscript: alert(); ">', true)).toBe('<img>');
        expect(htmlSanitizer('<img src="  LIVEScript: alert() ;">', true)).toBe('<img>');
        expect(htmlSanitizer('<img src="java<!-- -->script:alert();">', true)).toBe('<img>');
      });

      it('src and onerror attribute with img tag', () => {
        expect(
          htmlSanitizer(
            '<img src = x onerror = "javascript: window.onerror = alert; throw XSS">',
            true
          )
        ).toBe('<img src="x">');
        expect(htmlSanitizer('"><img src="x:x" onerror="alert(XSS)">', true)).toBe('"&gt;<img>');
        expect(htmlSanitizer('<img src=x:alert(alt) onerror=eval(src) alt=0>', true)).toBe(
          '<img alt="0">'
        );
      });
    });
  });
});
