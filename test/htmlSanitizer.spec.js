'use strict';

var htmlSanitizer = require('../src/js/htmlSanitizer');

describe('htmlSanitizer', function() {
    describe('tags', function() {
        it('escape script tags to text', function() {
            expect(htmlSanitizer('<script>alert("test");</script>', true)).toEqual('');
        });
    });

    describe('attributes', function() {
        it('Remove all attritube but white list', function() {
            var $img;
            var html = '<img class="V" title="V" data-custom="V" src="http://www.nhnent.com/renewal/img/ci_nhnent.png" onload="dd=1" />';
            var dom = htmlSanitizer(html);

            $img = $(dom).find('img');

            expect($img.attr('src')).toBeTruthy();
            expect($img.attr('class')).toBeTruthy();
            expect($img.attr('title')).toBeTruthy();
            expect($img.attr('data-custom')).toBeTruthy();

            expect($img.attr('onload')).not.toBeDefined();
        });
    });
});
