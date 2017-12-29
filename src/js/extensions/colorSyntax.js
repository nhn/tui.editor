/**
* @fileoverview Implements Color syntax Extension
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import ColorPicker from 'tui-color-picker';

import Editor from './editorProxy';

const colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g;
const colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
const colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
const decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

const RESET_COLOR = '#181818';

/**
 * color syntax extension
 * @param {editor} editor - editor
 * @ignore
 */
function colorSyntaxExtension(editor) {
  const {colorSyntax = {}} = editor.options;
  const {preset, useCustomSyntax = false} = colorSyntax;

  editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
    let replacement;

    if (!useCustomSyntax) {
      replacement = html;
    } else {
      replacement
                = html.replace(colorSyntaxRx, (matched, p1, p2) => makeHTMLColorSyntaxAndTextRange(p2, p1).result);
    }

    return replacement;
  });

  editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', markdown => {
    const findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

    return markdown.replace(findRx, (founded, color, text) => {
      let replacement;

      if (color.match(decimalColorRx)) {
        color = changeDecColorsToHex(color);
      }

      if (!useCustomSyntax) {
        replacement = founded.replace(/ ?class="colour" ?/g, ' ').replace(decimalColorRx, color);
      } else {
        replacement = makeCustomColorSyntaxAndTextRange(text, color).result;
      }

      return replacement;
    });
  });

  if (!editor.isViewer() && editor.getUI().name === 'default') {
    editor.addCommand('markdown', {
      name: 'color',
      exec(mde, color) {
        const cm = mde.getEditor();
        const rangeFrom = cm.getCursor('from');
        const rangeTo = cm.getCursor('to');
        let replacedText;
        let replacedFrom;

        if (!color) {
          return;
        }

        if (!useCustomSyntax) {
          ({result: replacedText, from: replacedFrom}
                        = makeHTMLColorSyntaxAndTextRange(cm.getSelection(), color));
          cm.replaceSelection(replacedText);
        } else {
          ({result: replacedText, from: replacedFrom}
                        = makeCustomColorSyntaxAndTextRange(cm.getSelection(), color));
          cm.replaceSelection(replacedText);
        }

        cm.setSelection({
          line: rangeFrom.line,
          ch: rangeFrom.ch + replacedFrom
        }, {
          line: rangeTo.line,
          ch: rangeFrom.line === rangeTo.line ? rangeTo.ch + replacedFrom : rangeTo.ch
        });

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
}

/**
 * Initialize UI
 * @param {object} editor Editor instance
 * @param {Array.<string>} preset Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
  const className = 'tui-color';
  const i18n = editor.i18n;

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

  const colorPicker = ColorPicker.create(cpOptions);

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
      const position = $button.position();
      popup.$el.css({
        top: position.top + $button.outerHeight(true),
        left: position.left
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
 * make custom color syntax
 * @param {string} text - Text content
 * @param {string} color - Color value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeCustomColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange(`{color:${color}}`, text, '{color}');
}

/**
 * Make HTML color syntax by given text content and color value
 * @param {string} text Text - content
 * @param {string} color Color - value
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function makeHTMLColorSyntaxAndTextRange(text, color) {
  return wrapTextAndGetRange(`<span style="color:${color}">`, text, '</span>');
}

/**
 * wrap text with pre & post and return with text range
 * @param {string} pre - text pre
 * @param {string} text - text
 * @param {string} post - text post
 * @returns {object} - wrapped text and range(from, to)
 * @ignore
 */
function wrapTextAndGetRange(pre, text, post) {
  return {
    result: `${pre}${text}${post}`,
    from: pre.length,
    to: pre.length + text.length
  };
}

/**
 * Change decimal color values to hexadecimal color value
 * @param {string} color Color value string
 * @returns {string}
 * @ignore
 */
function changeDecColorsToHex(color) {
  return color.replace(decimalColorRx, (colorValue, r, g, b) => {
    const hr = changeDecColorToHex(r);
    const hg = changeDecColorToHex(g);
    const hb = changeDecColorToHex(b);

    return `#${hr}${hg}${hb}`;
  });
}

/**
 * change individual dec color value to hex color
 * @param {string} color - individual color value
 * @returns {string} - zero padded color string
 * @ignore
 */
function changeDecColorToHex(color) {
  let hexColor = parseInt(color, 10);
  hexColor = hexColor.toString(16);
  hexColor = doubleZeroPad(hexColor);

  return hexColor;
}

/**
 * leading 2 zeros number string
 * @param {string} numberStr - number string
 * @returns {string}
 * @ignore
 */
function doubleZeroPad(numberStr) {
  const padded = ('00' + numberStr);

  return padded.substr(padded.length - 2);
}

Editor.defineExtension('colorSyntax', colorSyntaxExtension);

export default colorSyntaxExtension;
