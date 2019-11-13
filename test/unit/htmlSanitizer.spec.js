/**
 * @fileoverview test html sanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import htmlSanitizer from '@/htmlSanitizer';

describe('htmlSanitizer', function() {
  describe('tags', function() {
    it('Remove unnecessary tags', function() {
      expect(htmlSanitizer('<script>alert("test");</script>', true)).toBe('');
      expect(htmlSanitizer('<embed>child alive</embed>', true)).toBe('child alive');
      expect(htmlSanitizer('<object>child die</object>', true)).toBe('');
      expect(htmlSanitizer('<details><summary>foo</summary></details>', true)).toBe('');
    });
  });

  describe('attributes', () => {
    it('Remove all attritube but white list', () => {
      var html = '<img style="display:inline" class="V" title="V" data-custom="V" src="http://www.nhn.com/renewal/img/ci_nhn.png" onload="dd=1" />';
      var dom = htmlSanitizer(html);

      const $img = $(dom).find('img');

      expect($img.attr('src')).toBeTruthy();
      expect($img.attr('class')).toBeTruthy();
      expect($img.attr('title')).toBeTruthy();
      expect($img.attr('style')).toBeTruthy();
      expect($img.attr('data-custom')).toBeTruthy();

      expect($img.attr('onload')).not.toBeDefined();
    });

    it('Leave svg attributes', function() {
      const html = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>';
      const dom = htmlSanitizer(html);
      const $circle = $(dom).find('circle');

      expect($circle.attr('cx')).toBeTruthy();
      expect($circle.attr('cy')).toBeTruthy();
      expect($circle.attr('r')).toBeTruthy();
      expect($circle.attr('stroke')).toBeTruthy();
      expect($circle.attr('stroke-width')).toBeTruthy();
      expect($circle.attr('fill')).toBeTruthy();
    });

    it('Remove attributes with invalid value', function() {
      expect(htmlSanitizer('<a href="javascript:alert();">xss</a>', true)).toBe('<a>xss</a>');
      expect(htmlSanitizer('<a href="JaVaScRiPt:alert();">xss</a>', true)).toBe('<a>xss</a>');
      expect(htmlSanitizer('<a href="#">benign</a>', true)).toBe('<a href="#">benign</a>');
      expect(htmlSanitizer('<a href="http://example.com">http</a>', true)).toBe('<a href="http://example.com">http</a>');
      expect(htmlSanitizer('<a href="https://example.com">https</a>', true)).toBe('<a href="https://example.com">https</a>');
      expect(htmlSanitizer('<a href="ftp://example.com">ftp</a>', true)).toBe('<a href="ftp://example.com">ftp</a>');
    });
  });
});
