'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    it('if pass empty string or falsy object return empty string', function() {
        expect(toMark('')).toEqual('');
        expect(toMark(false)).toEqual('');
        expect(toMark()).toEqual('');
        expect(toMark(null)).toEqual('');
    });
    it('markdown text\'s EOL FOL newline characters should be removed', function() {
        expect(toMark('<h1>Hello World</h1>')).toEqual('# Hello World');
        expect(toMark('<h1>Hello World</h1><br />')).toEqual('# Hello World');
    });

    it('Empty spaces more than 1 are removed even if flanked space in tags', function() {
        expect(toMark('<h2>Hello <em> World</em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2>Hello  <em>World</em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2>Hello  <em>World </em></h2>')).toEqual('## Hello *World*');
        expect(toMark('<h2><em>Hello</em> <em>World</em></h2>')).toEqual('## *Hello* *World*');
        expect(toMark('<h2><em>Hello</em> World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello </em> World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello </em>World</em></h2>')).toEqual('## *Hello* World');
        expect(toMark('<h2><em>Hello</em>  &nbsp;&nbsp;World</h2>')).toEqual('## *Hello* \u00a0\u00a0World');
        expect(toMark('<h2><em>Hello&nbsp;</em>  &nbsp;&nbsp;World</h2>')).toEqual('## *Hello\u00a0* \u00a0\u00a0World');
    });

    it('p and inlines', function() {
        expect(toMark('<p>this is link <a href="http://nhnent.com">link</a></p>')).toEqual('this is link [link](http://nhnent.com/)');
        expect(toMark('<p><em>this</em> is link <a href="http://nhnent.com">link</a></p>')).toEqual('*this* is link [link](http://nhnent.com/)');
        expect(toMark('<p><em>this</em> is &nbsp;<strong>strong</strong></p>')).toEqual('*this* is \u00a0**strong**');
    });

    it('pass gfm false option to using basic markdown renderer', function() {
        expect(toMark('<del>strike</del>', {
            gfm: false
        })).toEqual('strike');

        expect(toMark('<del>strike</del>')).toEqual('~~strike~~');
    });

    it('collapse triple returns made by consecutive block element', function() {
        expect(toMark('<p>text</p><p>text</p>')).toEqual('text\n\ntext');
    });

    describe('finalize markdown text', function() {
        it('process br', function() {
            expect(toMark('<p>text<br /></p><p>text</p>', {gfm: false})).toEqual('text\n\ntext');
            expect(toMark('<p>text<br />text<br /></p><p>text</p>', {gfm: false})).toEqual('text  \ntext\n\ntext');
            expect(toMark('<p>text<br />text  &nbsp;<br /></p><p>text</p>', {gfm: false})).toEqual('text  \ntext\n\ntext');
            expect(toMark('<p>text<br /></p><br /><p>text</p>', {gfm: false})).toEqual('text\n\n  \ntext');
            expect(toMark('<p>text<br /></p><br /><p>text</p>')).toEqual('text\n\n\ntext');
        });

        it('process returns between block tags', function() {
            expect(toMark('<ul><li>text<br></li><li>text<br></li></ul>', {gfm: false})).toEqual('* text\n* text');
            expect(toMark('<ul><li>text<br><ul><li>text<br>text</li><li>text<br></li></ul></li></ul>', {gfm: false})).toEqual('* text\n    * text  \n    text\n    * text');
            expect(toMark('<ul><li>text<br><ul><li>text<br></li><li>text<br></li></ul></li></ul>', {gfm: false})).toEqual('* text\n    * text\n    * text');
            expect(toMark('<ul><li>text<br></li></ul><p>text</p>', {gfm: false})).toEqual('* text\n\ntext');
            expect(toMark('<ul><li>text<br></li></ul><p><div>text<br></div><div>text<br></div></p>', {gfm: false})).toEqual('* text\n\ntext  \ntext');
            expect(toMark('<ul><li>text<br></li></ul><p><div>text<br></div><div>text<br></div></p>')).toEqual('* text\n\ntext\ntext');
            expect(toMark('<ul><li>text</li></ul><p></p><ul><li>text</li></ul>', {gfm: false})).toEqual('* text\n\n* text');
        });

        it('process empty multi line', function() {
            expect(toMark('<p>text1<br /><br /><br />text</p>')).toEqual('text1\ntext');
            expect(toMark('<p>text2<br /><br />text</p>')).toEqual('text2\ntext');
            expect(toMark('<p>text3</p><br /><br /><p>text</p>')).toEqual('text3\n\ntext');
        });
    });
});
