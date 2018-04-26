/**
 * @fileoverview test html sanitizer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import htmlSanitizer from '../../src/js/htmlSanitizer';

describe('htmlSanitizer', function() {
  describe('tags', function() {
    it('escape script tags to text', function() {
      expect(htmlSanitizer('<script>alert("test");</script>', true)).toEqual('');
    });
  });

  describe('attributes', () => {
    it('Remove all attritube but white list', () => {
      var html = '<img style="display:inline" class="V" title="V" data-custom="V" src="http://www.nhnent.com/renewal/img/ci_nhnent.png" onload="dd=1" />';
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
  });
});
