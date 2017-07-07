/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import extManager from '../extManager';
import i18n from '../i18n';

const colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g;
const colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
const colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
const decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

const RESET_COLOR = '#181818';

extManager.defineExtension('colorSyntax', editor => {
    const {colorSyntax = {}} = editor.options;
    const {preset, useCustomSyntax = false} = colorSyntax;

    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
        let replacement;

        if (!useCustomSyntax) {
            replacement = html;
        } else {
            replacement = html.replace(colorSyntaxRx, (matched, p1, p2) => makeHTMLColorSyntax(p2, p1));
        }

        return replacement;
    });

    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', markdown => {
        const findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

        return markdown.replace(findRx, (founded, color, text) => {
            let replacement;

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
            exec(mde, color) {
                const cm = mde.getEditor();

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
            exec(wwe, color) {
                const sq = wwe.getEditor();

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

                wwe.focus();
            }
        });

        initUI(editor, preset);
    }
});

/**
 * Initialize UI
 * @param {object} editor Editor instance
 * @param {Array.<string>} preset Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
    const className = 'tui-color';

    editor.eventManager.addEventType('colorButtonClicked');

    editor.getUI().toolbar.addButton({
        className,
        event: 'colorButtonClicked',
        tooltip: i18n.get('Text color')
    }, 4);
    const $button = editor.getUI().toolbar.$el.find(`button.${className}`);

    const $colorPickerContainer = $('<div />');

    const $buttonBar = $('<button type="button" class="te-apply-button">입력</button>');

    const cpOptions = {
        container: $colorPickerContainer[0]
    };

    if (preset) {
        cpOptions.preset = preset;
    }

    const colorPicker = tui.component.colorpicker.create(cpOptions);

    let selectedColor = colorPicker.getColor();

    $colorPickerContainer.append($buttonBar);

    const popup = editor.getUI().createPopup({
        header: false,
        title: false,
        content: $colorPickerContainer,
        className: 'tui-popup-color',
        $target: editor.getUI().$el,
        css: {
            'width': 'auto',
            'position': 'absolute'
        }
    });

    editor.eventManager.listen('focus', () => {
        popup.hide();
    });

    editor.eventManager.listen('colorButtonClicked', () => {
        editor.eventManager.emit('closeAllPopup');
        if (popup.isShow()) {
            popup.hide();
        } else {
            popup.$el.css({
                'top': $button.offset().top + $button.height(),
                'left': $button.offset().left,
                'position': 'fixed'
            });
            popup.show();
            colorPicker.slider.toggle(true);
        }
    });

    editor.eventManager.listen('closeAllPopup', () => {
        popup.hide();
    });

    editor.eventManager.listen('removeEditor', () => {
        colorPicker.off('selectColor');
    });

    colorPicker.on('selectColor', e => {
        selectedColor = e.color;

        if (e.origin === 'palette') {
            editor.exec('color', selectedColor);
            popup.hide();
        }
    });

    popup.$el.find('.te-apply-button').on('click', () => {
        editor.exec('color', selectedColor);
    });
}

/**
 * Make custom color syntax
 * @param {string} text Text content
 * @param {string} color Color value
 * @returns {string}
 * @ignore
 */
function makeCustomColorSyntax(text, color) {
    return `{color:${color}}${text}{color}`;
}

/**
 * Make HTML color syntax by given text content and color value
 * @param {string} text Text content
 * @param {string} color Color value
 * @returns {string}
 * @ignore
 */
function makeHTMLColorSyntax(text, color) {
    return `<span style="color:${color}">${text}</span>`;
}

/**
 * Change decimal color value to hexadecimal color value
 * @param {string} color Color value string
 * @returns {string}
 * @ignore
 */
function changeDecColorToHex(color) {
    return color.replace(decimalColorRx, (colorValue, r, g, b) => {
        r = parseInt(r, 10);
        g = parseInt(g, 10);
        b = parseInt(b, 10);

        const colorHexValue = get2DigitNumberString(r.toString(16))
            + get2DigitNumberString(g.toString(16))
            + get2DigitNumberString(b.toString(16));

        return `#${colorHexValue}`;
    });
}

/**
 * Get binary number string
 * @param {string} numberStr String to convert binary number
 * @returns {string}
 * @ignore
 */
function get2DigitNumberString(numberStr) {
    return numberStr === '0' ? '00' : numberStr;
}
