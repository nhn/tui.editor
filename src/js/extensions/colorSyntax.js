/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager');

var colorSyntaxRx = /{color:(.+?)}(.*?){color}/g,
    colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g,
    colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g,
    decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

var RESET_COLOR = '#181818';

extManager.defineExtension('colorSyntax', function(editor) {
    var useCustomSyntax = false;

    if (editor.options.colorSyntax) {
        useCustomSyntax = !!editor.options.colorSyntax.useCustomSyntax;
    }

    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function(html) {
        var replacement;

        if (!useCustomSyntax) {
            replacement = html;
        } else {
            replacement = html.replace(colorSyntaxRx, function(matched, p1, p2) {
                return makeHTMLColorSyntax(p2, p1);
            });
        }

        return replacement;
    });

    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function(markdown) {
        var findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

        return markdown.replace(findRx, function(founded, color, text) {
            var replacement;

            if (color.match(decimalColorRx)) {
                color = changeDecColorToHex(color);
            }

            if (!useCustomSyntax) {
                replacement = founded.replace(/ ?class="colour" ?/g, ' ').replace(decimalColorRx, color);
            } else {
                replacement = makeCustomColorSyntax(text, color);
            }

            return replacement;
        });
    });

    editor.addCommand('markdown', {
        name: 'color',
        exec: function(mde, color) {
            var cm = mde.getEditor();

            if (!useCustomSyntax) {
                cm.replaceSelection(makeHTMLColorSyntax(cm.getSelection(), color));
            } else {
                cm.replaceSelection(makeCustomColorSyntax(cm.getSelection(), color));
            }

            mde.focus();
        }
    });

    editor.addCommand('wysiwyg', {
        name: 'color',
        exec: function(wwe, color) {
            if (color === RESET_COLOR) {
               wwe.getEditor().changeFormat(null, {
                   class: 'colour',
                   tag: 'span'
               });
            } else {
                wwe.getEditor().setTextColour(color);
            }
            wwe.focus();
        }
    });

    if (editor.getUI().name === 'default') {
        initUI(editor);
    }
});

function initUI(editor) {
    var $colorPickerContainer, colorPicker, popup, $buttonBar, selectedColor;

    editor.eventManager.addEventType('colorButtonClicked');

    editor.getUI().toolbar.addButton({
        className: 'color',
        event: 'colorButtonClicked',
        text: 'Color'
    });

    $colorPickerContainer =  $('<div />');

    $buttonBar = $('<div><button type="button" class="applyButton">입력</button></div>');
    $buttonBar.css('margin-top', 10);

    colorPicker = tui.component.colorpicker.create({
        container: $colorPickerContainer[0]
    });

    $colorPickerContainer.append($buttonBar);

    popup = editor.getUI().createPopup({
        title: false,
        content: $colorPickerContainer,
        $target: editor.getUI().$el,
        css: {
            'width': 178,
            'position': 'absolute',
            'top': $('button.color').offset().top + $('button.color').height() + 5,
            'left': $('button.color').offset().left
        }
    });

    editor.eventManager.listen('focus', function() {
        popup.hide();
    });

    editor.eventManager.listen('colorButtonClicked', function() {
        if (popup.isShow()) {
            popup.hide();
        } else {
            popup.show();
        }
    });

    editor.eventManager.listen('closeAllPopup', function() {
        popup.hide();
    });

    colorPicker.on('selectColor', function(e) {
        selectedColor = e.color;
    });

    popup.$el.find('.applyButton').on('click', function() {
        editor.exec('color', selectedColor);
    });
}

function makeCustomColorSyntax(text, color) {
    return '{color:' + color + '}' + text + '{color}';
}

function makeHTMLColorSyntax(text, color) {
    return '<span style="color:' + color + '">' + text + '</span>';
}

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
