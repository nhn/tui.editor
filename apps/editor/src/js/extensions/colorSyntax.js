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

    if (!editor.isViewOnly() && editor.getUI().name === 'default') {
        editor.addCommand('markdown', {
            name: 'color',
            exec: function(mde, color) {
                var cm = mde.getEditor();

                if (!color) {
                    return;
                }

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
                var sq = wwe.getEditor();

                if (!color) {
                    return;
                }

                if (!sq.hasFormat('PRE')) {
                    if (color === RESET_COLOR) {
                        sq.changeFormat(null, {
                            class: 'colour',
                            tag: 'span'
                        });
                    } else {
                        sq.setTextColour(color);
                    }
                }

                sq.focus();
            }
        });

        initUI(editor);
    }
});

function initUI(editor) {
    var $colorPickerContainer, $button, colorPicker, popup, $buttonBar, selectedColor, className;

    className = 'tui-color';

    editor.eventManager.addEventType('colorButtonClicked');

    editor.getUI().toolbar.addButton({
        className: className,
        event: 'colorButtonClicked',
        tooltip: '글자색상'
    }, 2);
    $button = editor.getUI().toolbar.$el.find('button.' + className);

    $colorPickerContainer = $('<div />');

    $buttonBar = $('<div><button type="button" class="te-apply-button">입력</button></div>');
    $buttonBar.css('margin-top', 10);

    colorPicker = tui.component.colorpicker.create({
        container: $colorPickerContainer[0]
    });

    selectedColor = colorPicker.getColor();

    $colorPickerContainer.append($buttonBar);

    popup = editor.getUI().createPopup({
        title: false,
        content: $colorPickerContainer,
        $target: editor.getUI().$el,
        css: {
            'width': 178,
            'position': 'absolute'
        }
    });

    editor.eventManager.listen('focus', function() {
        popup.hide();
    });

    editor.eventManager.listen('colorButtonClicked', function() {
        editor.eventManager.emit('closeAllPopup');
        if (popup.isShow()) {
            popup.hide();
        } else {
            popup.$el.css({
                'top': $button.position().top + $button.height() + 5,
                'left': $button.position().left
            });
            popup.show();
        }
    });

    editor.eventManager.listen('closeAllPopup', function() {
        popup.hide();
    });

    editor.eventManager.listen('removeEditor', function() {
        colorPicker.off('selectColor');
    });

    colorPicker.on('selectColor', function(e) {
        selectedColor = e.color;

        if (e.origin === 'palette') {
            editor.exec('color', selectedColor);
            popup.hide();
        }
    });

    popup.$el.find('.te-apply-button').on('click', function() {
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

        return '#' + get2DigitNumberString(r.toString(16))
            + get2DigitNumberString(g.toString(16))
            + get2DigitNumberString(b.toString(16));
    });
}

function get2DigitNumberString(numberStr) {
    return numberStr === '0' ? '00' : numberStr;
}
