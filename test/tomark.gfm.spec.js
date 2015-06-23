'use strict';

var toMark = require('../src/toMark');

describe('toMark', function() {
    describe('table', function() {
        it('single td', function() {
            var htmlStr = [
                '<table>',
                    '<tr>',
                        '<td>text</td>',
                    '</tr>',
                '</table>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('| text |');
        });

        it('multiple td', function() {
            var htmlStr = [
                '<table>',
                    '<tr>',
                        '<td>text</td>',
                        '<td>text</td>',
                    '</tr>',
                '</table>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('| text | text |');
        });

        it('multiple th', function() {
            var htmlStr = [
                '<table>',
                    '<thead>',
                        '<tr>',
                            '<th>text</th>',
                            '<th>text</th>',
                        '</tr>',
                    '</thead>',
                '</table>'
            ].join('');

            expect(toMark(htmlStr)).toEqual('| text | text |\n| ---- | ---- |');
        });

        it('complete table', function() {
            var htmlStr = [
                '<table>',
                    '<thead>',
                        '<tr>',
                            '<th align="left">leftHead</th>',
                            '<th align="center">centerHead</th>',
                            '<th align="right">rightHead</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
                        '<tr>',
                            '<td>text1</td>',
                            '<td>text2</td>',
                            '<td>text3</td>',
                        '</tr>',
                        '<tr>',
                            '<td>text4</td>',
                            '<td>text5</td>',
                            '<td>text6</td>',
                        '</tr>',
                    '</tbody>',
                '</table>'
            ].join('');

            var expectText = [
                '| leftHead | centerHead | rightHead |',
                '| :------- | :--------: | --------: |',
                '| text1 | text2 | text3 |',
                '| text4 | text5 | text6 |'
            ].join('\n');

            expect(toMark(htmlStr)).toEqual(expectText);

            /*
            var dd - toMark(htmlStr);

            for (var i - 0; i < dd.length; i++) {
                if (dd.charAt(i) !-- expectText.charAt(i)) {
                    console.log(dd.charAt(i), dd.charCodeAt(i), expectText.charAt(i), expectText.charCodeAt(i));
                }
            }
*/
        });
    });
});
