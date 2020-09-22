/**
 * @fileoverview Implements color syntax plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ColorPicker from 'tui-color-picker';

import css from 'tui-code-snippet/domUtil/css';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

const colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g;
const colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
const colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
const decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

const RESET_COLOR = '#181818';

let lastScrollTop = 0;

/**
 * Set style color
 * @param {SquireExt} sq - squire ext instance
 * @param {string} color - color sting value
 * @ignore
 */
function setStyleColor(sq, color) {
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
}

/**
 * Get scrollTop of squire
 * @param {SquireExt} sq - squire ext instance
 * @ignore
 */
function getScrollTopForReFocus(sq) {
  return sq.getRoot().parentNode.scrollTop;
}

/**
 * Create button element for applying color
 * @param {string} text - button's text
 * @returns {HTMLElement} button element
 * @ignore
 */
function createApplyButton(text) {
  const button = document.createElement('button');

  button.setAttribute('type', 'button');
  button.className = 'te-apply-button';
  button.innerHTML = text;

  return button;
}

/**
 * Initialize UI
 * @param {object} editor - Editor instance
 * @param {Array.<string>} preset - Preset for color palette
 * @ignore
 */
function initUI(editor, preset) {
  const name = 'colorSyntax';
  const className = 'tui-color';
  const { i18n } = editor;
  const toolbar = editor.getUI().getToolbar();
  const { usageStatistics } = editor.options;

  editor.eventManager.addEventType('colorButtonClicked');

  toolbar.insertItem(3, {
    type: 'button',
    options: {
      name,
      className,
      event: 'colorButtonClicked',
      tooltip: i18n.get('Text color')
    }
  });
  const colorSyntaxButtonIndex = toolbar.indexOfItem(name);
  const { el: button } = toolbar.getItem(colorSyntaxButtonIndex);

  const colorPickerContainer = document.createElement('div');

  const buttonBar = createApplyButton(`${i18n.get('OK')}`);
  const cpOptions = {
    container: colorPickerContainer,
    usageStatistics
  };

  if (preset) {
    cpOptions.preset = preset;
  }

  const colorPicker = ColorPicker.create(cpOptions);

  let selectedColor = colorPicker.getColor();

  colorPickerContainer.appendChild(buttonBar);

  const popup = editor.getUI().createPopup({
    header: false,
    title: null,
    content: colorPickerContainer,
    className: 'tui-popup-color',
    target: editor.getUI().getToolbar().el,
    css: {
      width: 'auto',
      position: 'absolute'
    }
  });

  editor.eventManager.listen('focus', () => {
    popup.hide();

    if (editor.isWysiwygMode() && lastScrollTop) {
      editor.getSquire().getRoot().parentNode.scrollTop = lastScrollTop;
      lastScrollTop = 0;
    }
  });

  editor.eventManager.listen('colorButtonClicked', () => {
    if (popup.isShow()) {
      popup.hide();

      return;
    }

    const { offsetTop, offsetLeft, offsetHeight } = button;

    css(popup.el, {
      top: `${offsetTop + offsetHeight}px`,
      left: `${offsetLeft}px`
    });
    colorPicker.slider.toggle(true);

    editor.eventManager.emit('closeAllPopup');
    popup.show();
  });

  editor.eventManager.listen('closeAllPopup', () => {
    popup.hide();
  });

  editor.eventManager.listen('removeEditor', () => {
    colorPicker.off('selectColor');
    off(popup.el.querySelector('.te-apply-button'), 'click');
    popup.remove();
  });

  colorPicker.on('selectColor', e => {
    selectedColor = e.color;

    if (e.origin === 'palette') {
      editor.exec('color', selectedColor);
      popup.hide();
    }
  });

  on(popup.el.querySelector('.te-apply-button'), 'click', () => {
    editor.exec('color', selectedColor);
  });
}

/**
 * Make custom color syntax
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
 * Wrap text with pre & post and return with text range
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
 * Change individual dec color value to hex color
 * @param {string} color - individual color value
 * @returns {string} - zero padded color string
 * @ignore
 */
function changeDecColorToHex(color) {
  let hexColor = parseInt(color, 10);

  hexColor = hexColor.toString(16);
  hexColor = addDoubleZeroPad(hexColor);

  return hexColor;
}

/**
 * Add leading 2 zeros number string
 * @param {string} numberStr - number string
 * @returns {string}
 * @ignore
 */
function addDoubleZeroPad(numberStr) {
  const padded = `00${numberStr}`;

  return padded.substr(padded.length - 2);
}

/**
 * Color syntax plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
export default function colorSyntaxPlugin(editor, options = {}) {
  const { preset, useCustomSyntax = false } = options;

  editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
    let replacement;

    if (!useCustomSyntax) {
      replacement = html;
    } else {
      replacement = html.replace(
        colorSyntaxRx,
        (matched, p1, p2) => makeHTMLColorSyntaxAndTextRange(p2, p1).result
      );
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
          ({ result: replacedText, from: replacedFrom } = makeHTMLColorSyntaxAndTextRange(
            cm.getSelection(),
            color
          ));
          cm.replaceSelection(replacedText);
        } else {
          ({ result: replacedText, from: replacedFrom } = makeCustomColorSyntaxAndTextRange(
            cm.getSelection(),
            color
          ));
          cm.replaceSelection(replacedText);
        }

        cm.setSelection(
          {
            line: rangeFrom.line,
            ch: rangeFrom.ch + replacedFrom
          },
          {
            line: rangeTo.line,
            ch: rangeFrom.line === rangeTo.line ? rangeTo.ch + replacedFrom : rangeTo.ch
          }
        );

        mde.focus();
      }
    });

    editor.addCommand('wysiwyg', {
      name: 'color',
      exec(wwe, color) {
        if (!color) {
          return;
        }

        const sq = wwe.getEditor();
        const tableSelectionManager = wwe.componentManager.getManager('tableSelection');

        // Cache scrollTop before change text color.
        // Because scrollTop is set 0 when focus() is called.
        // focus() is called when change text color.
        lastScrollTop = getScrollTopForReFocus(sq);

        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
          tableSelectionManager.styleToSelectedCells(setStyleColor, color);

          const range = sq.getSelection();

          range.collapse(true);
          sq.setSelection(range);
        } else {
          setStyleColor(sq, color);
        }
      }
    });

    initUI(editor, preset);
  }
}
