'use strict';

var NeonEditor = require('../../src/js/editor');

//var loadStyleFixtures = window.loadStyleFixtures;

describe('colorSyntax', function() {
    var ned;

    beforeEach(function(done) {
        $('body').html('<div id="editSection"></div>');

        ned = new NeonEditor({
            el: $('#editSection'),
            previewStyle: 'vertical',
            height: 100,
            initialEditType: 'markdown',
            exts: ['colorSyntax'],
            events: {
                'load': function() {
                    done();
                }
            }
        });
    });

    afterEach(function() {
        $('body').empty();
    });


    describe('conversion', function() {
        var actual, expected;

        beforeEach(function() {
            actual = null;
            expected = null;
        });

        it('convert html to color syntax', function() {
            var src = '<span class="colour" style="color:rgb(255,0,255)">test</span>';
            actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
            expected = '{color:#ff00ff}test{color}';

            expect(actual).toEqual(expected);
        });

        it('convert multiple color html to color syntax', function() {
            var src = '<span class="colour" style="color:rgb(255,0,255)">test</span>test2<span class="colour" style="color:rgb(255,0,255)">test3</span>';
            actual = ned.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', src);
            expected = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';

            expect(actual).toEqual(expected);
        });

        it('convert color syntax to html', function() {
            var src = '{color:#ff00ff}test{color}';
            actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
            expected = '<span style="color:#ff00ff">test</span>';

            expect(actual).toEqual(expected);
        });

        it('convert multiple color syntax to html', function() {
            var src = '{color:#ff00ff}test{color}test2{color:#ff00ff}test3{color}';
            actual = ned.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', src);
            expected = '<span style="color:#ff00ff">test</span>test2<span style="color:#ff00ff">test3</span>';

            expect(actual).toEqual(expected);
        });
    });
});
