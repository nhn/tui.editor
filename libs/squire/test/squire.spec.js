/*global expect, describe, afterEach, beforeEach, it */
expect = expect.clone()
    .addType({
        name: 'SquireRTE',
        base: 'object',
        identify: function (value) {
            return value instanceof Squire;
        },
        inspect: function (value) {
            return 'Squire RTE: ' + value.getHTML();
        }
    })
    .addAssertion('[not] to contain HTML', function (expect, editor, expectedValue) {
        this.errorMode = 'bubble';
        var actualHTML = editor.getHTML().replace(/<br>/g, '');
        // BR tags are inconsistent across browsers. Removing them allows cross-browser testing.
        expect(actualHTML, '[not] to be', expectedValue);
    });

describe('Squire RTE', function () {
    var doc, editor;
    beforeEach(function () {
        var iframe = document.getElementById('testFrame');
        doc = iframe.contentDocument;
        editor = new Squire(doc);
    });

    function selectAll(editor) {
        doc.getSelection().removeAllRanges()
        var range = doc.createRange();
        range.setStart(doc.body.childNodes.item(0), 0);
        range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
        editor.setSelection(range);
    }

    describe('hasFormat', function () {
        var startHTML;
        beforeEach( function () {
            startHTML = '<div>one <b>two three</b> four <i>five</i></div>';
            editor.setHTML(startHTML);
        });

        it('returns false when range not touching format', function () {
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0), 0);
            range.setEnd(doc.body.childNodes.item(0), 1);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be false');
        });

        it('returns false when range inside other format', function () {
            var range = doc.createRange();
            range.setStart(doc.querySelector('i').childNodes[0], 1);
            range.setEnd(doc.querySelector('i').childNodes[0], 2);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be false');
        });

        it('returns false when range covers anything outside format', function () {
            var range = doc.createRange();
            range.setStart(doc.querySelector('b').previousSibling, 2);
            range.setEnd(doc.querySelector('b').childNodes[0], 8);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be false');
        });

        it('returns true when range inside format', function () {
            var range = doc.createRange();
            range.setStart(doc.querySelector('b').childNodes[0], 2);
            range.setEnd(doc.querySelector('b').childNodes[0], 8);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });

        it('returns true when range covers start of format', function () {
            var range = doc.createRange();
            range.setStartBefore(doc.querySelector('b'));
            range.setEnd(doc.querySelector('b').childNodes[0], 8);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });

        it('returns true when range covers start of format, even in weird cases', function () {
            var range = doc.createRange();
            var prev = doc.querySelector('b').previousSibling;
            range.setStart(prev, prev.length);
            range.setEnd(doc.querySelector('b').childNodes[0], 8);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });

        it('returns true when range covers end of format', function () {
            var range = doc.createRange();
            range.setStart(doc.querySelector('b').childNodes[0], 2);
            range.setEndAfter(doc.querySelector('b'));
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });

        it('returns true when range covers end of format, even in weird cases', function () {
            var range = doc.createRange();
            range.setStart(doc.querySelector('b').childNodes[0], 2);
            var next = doc.querySelector('b').nextSibling;
            range.setEnd(next, 0);
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });

        it('returns true when range covers all of format', function () {
            var range = doc.createRange();
            range.setStartBefore(doc.querySelector('b'));
            range.setEndAfter(doc.querySelector('b'));
            editor.setSelection(range);
            expect(editor.hasFormat('b'), 'to be true');
        });
    });

    describe('removeAllFormatting', function () {
        // Trivial cases
        it('removes inline styles', function () {
            var startHTML = '<div><i>one</i> <b>two</b> <u>three</u> <sub>four</sub> <sup>five</sup></div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            selectAll(editor);
            editor.removeAllFormatting();
            expect(editor, 'to contain HTML', '<div>one two three four five</div>');
        });
        it('removes block styles', function () {
            var startHTML = '<div><blockquote>one</blockquote><ul><li>two</li></ul>' +
                '<ol><li>three</li></ol><table><tbody><tr><th>four</th><td>five</td></tr></tbody></table></div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            selectAll(editor);
            editor.removeAllFormatting();
            var expectedHTML = '<div>one</div><div>two</div><div>three</div><div>four</div><div>five</div>';
            expect(editor, 'to contain HTML', expectedHTML);
        });

        // Potential bugs
        it('removes styles that begin inside the range', function () {
            var startHTML = '<div>one <i>two three four five</i></div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0), 0);
            range.setEnd(doc.getElementsByTagName('i').item(0).childNodes.item(0), 4);
            editor.removeAllFormatting(range);
            expect(editor, 'to contain HTML', '<div>one two <i>three four five</i></div>');
        });

        it('removes styles that end inside the range', function () {
            var startHTML = '<div><i>one two three four</i> five</div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            var range = doc.createRange();
            range.setStart(doc.getElementsByTagName('i').item(0).childNodes.item(0), 13);
            range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
            editor.removeAllFormatting(range);
            expect(editor, 'to contain HTML', '<div><i>one two three</i> four five</div>');
        });

        it('removes styles enclosed by the range', function () {
            var startHTML = '<div>one <i>two three four</i> five</div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0), 0);
            range.setEnd(doc.body.childNodes.item(0), doc.body.childNodes.item(0).childNodes.length);
            editor.removeAllFormatting(range);
            expect(editor, 'to contain HTML', '<div>one two three four five</div>');
        });

        it('removes styles enclosing the range', function () {
            var startHTML = '<div><i>one two three four five</i></div>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            var range = doc.createRange();
            range.setStart(doc.getElementsByTagName('i').item(0).childNodes.item(0), 4);
            range.setEnd(doc.getElementsByTagName('i').item(0).childNodes.item(0), 18);
            editor.removeAllFormatting(range);
            expect(editor, 'to contain HTML', '<div><i>one </i>two three four<i> five</i></div>');
        });

        it('removes nested styles and closes tags correctly', function () {
            var startHTML = '<table><tbody><tr><td>one</td></tr><tr><td>two</td><td>three</td></tr><tr><td>four</td><td>five</td></tr></tbody></table>';
            editor.setHTML(startHTML);
            expect(editor, 'to contain HTML', startHTML);
            var range = doc.createRange();
            range.setStart(doc.getElementsByTagName('td').item(1), 0);
            range.setEnd(doc.getElementsByTagName('td').item(2), doc.getElementsByTagName('td').item(2).childNodes.length);
            editor.removeAllFormatting(range);
            expect(editor, 'to contain HTML', '<table><tbody><tr><td>one</td></tr></tbody></table>' +
                '<div>two</div>' +
                '<div>three</div>' +
                '<table><tbody><tr><td>four</td><td>five</td></tr></tbody></table>');
        });
    });

    describe('getPath', function () {
        var startHTML;
        beforeEach( function () {
            startHTML = '<div>one <b>two three</b> four <i>five</i></div>';
            editor.setHTML(startHTML);

            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0), 0);
            range.setEnd(doc.body.childNodes.item(0), 1);
            editor.setSelection(range);
        });

        it('returns the path to the selection', function () {
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0).childNodes.item(1), 0);
            range.setEnd(doc.body.childNodes.item(0).childNodes.item(1), 0);
            editor.setSelection(range);

            //Manually tell it to update the path
            editor._updatePath(range);
            expect(editor.getPath(), 'to be', 'DIV>B');
        });

        it('includes id in the path', function () {
            editor.insertHTML('<div id="spanId">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV#spanId');
        });

        it('includes class name in the path', function () {
            editor.insertHTML('<div class="myClass">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.myClass');
        });

        it('includes all class names in the path', function () {
            editor.insertHTML('<div class="myClass myClass2 myClass3">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.myClass.myClass2.myClass3');
        });

        it('includes direction in the path', function () {
            editor.insertHTML('<div dir="rtl">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV[dir=rtl]');
        });

        it('includes highlight value in the path', function () {
            editor.insertHTML('<div class="highlight" style="background-color: rgb(255, 0, 0)">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.highlight[backgroundColor=rgb(255,0,0)]');
        });

        it('includes color value in the path', function () {
            editor.insertHTML('<div class="colour" style="color: rgb(255, 0, 0)">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.colour[color=rgb(255,0,0)]');
        });

        it('includes font family value in the path', function () {
            editor.insertHTML('<div class="font" style="font-family: Arial, sans-serif">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.font[fontFamily=Arial,sans-serif]');
        });

        it('includes font size value in the path', function () {
            editor.insertHTML('<div class="size" style="font-size: 12pt">Text</div>');
            expect(editor.getPath(), 'to be', 'DIV.size[fontSize=12pt]');
        });

        it('is (selection) when the selection is a range', function() {
            var range = doc.createRange();
            range.setStart(doc.body.childNodes.item(0).childNodes.item(0), 0);
            range.setEnd(doc.body.childNodes.item(0).childNodes.item(3), 0);
            editor.setSelection(range);

            //Manually tell it to update the path
            editor._updatePath(range);

            expect(editor.getPath(), 'to be', '(selection)');
        });
    });

    describe('multi-level lists', function () {
      it('increases list indentation', function() {
        var startHTML = '<ul><li><div>a</div></li><li><div>b</div></li><li><div>c</div></li></ul>';
        editor.setHTML(startHTML);
        expect(editor, 'to contain HTML', startHTML);

        var range = doc.createRange();
        var textNode = doc.getElementsByTagName('li').item(1).childNodes[0].childNodes[0]
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
        editor.setSelection(range);

        editor.increaseListLevel()
        expect(editor, 'to contain HTML', '<ul><li><div>a</div></li><ul><li><div>b</div></li></ul><li><div>c</div></li></ul>');
      });

      it('increases list indentation 2', function() {
        var startHTML = '<ul><li><div>a</div></li><li><div>b</div></li><li><div>c</div></li></ul>';
        editor.setHTML(startHTML);
        expect(editor, 'to contain HTML', startHTML);

        var range = doc.createRange();
        var textNode = doc.getElementsByTagName('li').item(1).childNodes[0].childNodes[0]
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
        editor.setSelection(range);

        editor.increaseListLevel()
        editor.increaseListLevel()
        expect(editor, 'to contain HTML', '<ul><li><div>a</div></li><ul><ul><li><div>b</div></li></ul></ul><li><div>c</div></li></ul>');
      });

      it('decreases list indentation', function() {
        var startHTML = '<ul><li><div>a</div></li><ul><li><div>b</div></li></ul><li><div>c</div></li></ul>';
        editor.setHTML(startHTML);
        expect(editor, 'to contain HTML', startHTML);

        var range = doc.createRange();
        var textNode = doc.getElementsByTagName('li').item(1).childNodes[0].childNodes[0]
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
        editor.setSelection(range);

        editor.decreaseListLevel()
        expect(editor, 'to contain HTML', '<ul><li><div>a</div></li><li><div>b</div></li><li><div>c</div></li></ul>');
      });

      it('decreases list indentation 2', function() {
        var startHTML = '<ul><li><div>a</div></li><ul><ul><li><div>b</div></li></ul></ul><li><div>c</div></li></ul>';
        editor.setHTML(startHTML);
        expect(editor, 'to contain HTML', startHTML);

        var range = doc.createRange();
        var textNode = doc.getElementsByTagName('li').item(1).childNodes[0].childNodes[0]
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
        editor.setSelection(range);

        editor.decreaseListLevel()
        editor.decreaseListLevel()
        expect(editor, 'to contain HTML', '<ul><li><div>a</div></li><li><div>b</div></li><li><div>c</div></li></ul>');
      });

      it('removes lists', function() {
        var startHTML = '<ul><li><div>foo</div></li><ul><li><div>bar</div></li></ul></ul>';
        editor.setHTML(startHTML);
        expect(editor, 'to contain HTML', startHTML);

        var range = doc.createRange();
        var textNode = doc.getElementsByTagName('li').item(1).childNodes[0].childNodes[0]
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
        editor.setSelection(range);

        editor.removeList()
        expect(editor, 'to contain HTML', '<ul><li><div>foo</div></li></ul><div>bar</div>');
      })
    });

    describe('insertHTML', function() {
        it('fix CF_HTML incomplete table', function() {
            editor.insertHTML('<table><tbody><tr><!--StartFragment--><td>text</td><!--EndFragment--></tr></tbody></table>');
            expect(editor.getHTML(), 'to contain', '<table><tbody><tr><td>text<br></td></tr></tbody></table>');

            editor.setHTML('');

            editor.insertHTML('<table><tbody><!--StartFragment--><tr><td>text1</td><td>text2</td></tr><!--EndFragment--></tbody></table>');
            expect(editor.getHTML(), 'to contain', '<table><tbody><tr><td>text1<br></td><td>text2<br></td></tr></tbody></table>');
        });
    });

    afterEach(function () {
        editor = null;
        var iframe = document.getElementById('testFrame');
        iframe.src = 'blank.html';
    });
});
