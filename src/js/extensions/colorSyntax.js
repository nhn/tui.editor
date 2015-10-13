/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager');

var colorSyntaxRx = /{color:(.+?)}(.*?){color}/g,
    colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g,
    decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

extManager.defineExtension('colorSyntax', function(editor) {
    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function(html) {
        return html.replace(colorSyntaxRx, '<span style="color:$1">$2</span>');
    });

    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function(markdown) {
        return markdown.replace(colorHtmlRx, function(founded, color, text) {
            if (color.match(decimalColorRx)) {
                color = changeDecColorToHex(color);
            }

            return '{color:' + color + '}' + text + '{color}';
        });
    });
});

function changeDecColorToHex(color) {
    return color.replace(decimalColorRx, function(colorValue, r, g, b) {
        r = parseInt(r, 10);
        g = parseInt(g, 10);
        b = parseInt(b, 10);

        return '#' + get2DigitNumberString(r.toString(16)) + get2DigitNumberString(g.toString(16)) + get2DigitNumberString(b.toString(16));
    });
}

function get2DigitNumberString(numberStr) {
    return numberStr === '0' ? '00' : numberStr;
}

