/**
 * @fileoverview Implements code block editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CodeMirrorExt from './codeMirrorExt';

const EVENT_LANGUAGE_CHANGED = 'language-changed';

/**
 * Class Code Block Editor
 * @extends {CodeMirrorExt}
 */
class CodeBlockEditor extends CodeMirrorExt {
  /**
   * Creates an instance of CodeBlockEditor.
   * @param {HTMLElement} el - code block editor container element
   * @param {EventManager} eventManager - event manager
   * @memberof CodeBlockEditor
   */
  constructor(el, eventManager) {
    super(el, {
      singleCursorHeightPerLine: false,
      theme: 'none'
    });

    this._language = '';
    this._eventManager = eventManager;

    this._initEvent();
  }

  _initEvent() {
    this.on('cursorActivity', this._onRequireScrollIntoView.bind(this));
    this.on('beforeChange', (cm, ev) => {
      if (ev.origin === 'paste') {
        this._eventManager.emit('pasteBefore', {
          source: 'codeblock',
          data: ev
        });
      }
    });
  }

  _onRequireScrollIntoView() {
    const cursor = this.getCursor();
    const wrapper = this.getWrapperElement();

    // CodeMirror cursorActivity event fires before actually attach a new line element to DOM
    // we should proceed at next tick
    setTimeout(() => {
      const lineElement = wrapper.querySelector(`pre:nth-child(${cursor.line + 1})`);
      $(lineElement).trigger('requireScrollIntoView');
    }, 0);
  }

  /**
   * load code from code block element
   * @param {HTMLElement} codeBlockElement - code block element
   * @memberof CodeBlockEditor
   */
  load(codeBlockElement) {
    const el = codeBlockElement.cloneNode(true);
    const texts = [];

    const divs = el.querySelectorAll('div');
    [].slice.call(divs).forEach(div => {
      texts.push(div.innerText.replace(/\n$/, ''));
    });

    this.setLanguage(el.getAttribute('data-language') || '');
    this.setEditorCodeText(texts.join('\n'));
  }

  /**
   * save code to code block element
   * @param {HTMLElement} codeBlockElement - code block element
   * @memberof CodeBlockEditor
   */
  save(codeBlockElement) {
    codeBlockElement.innerHTML = '';

    const codeLines = this.getEditorCodeText().split('\n');
    codeLines.forEach(codeLine => {
      const div = document.createElement('div');
      codeBlockElement.appendChild(div);

      let childElement;
      if (codeLine.length > 0) {
        childElement = document.createTextNode(codeLine);
      } else {
        childElement = document.createElement('br');
      }
      div.appendChild(childElement);
    });

    codeBlockElement.setAttribute('data-language', this._language);
    $(codeBlockElement).trigger(EVENT_LANGUAGE_CHANGED);
  }

  /**
   * clear code and language
   * @memberof CodeBlockEditor
   */
  clear() {
    this.setLanguage('');
    this.setEditorCodeText('');
  }

  /**
   * get code language
   * @returns {string} - code language
   * @memberof CodeBlockEditor
   */
  getLanguage() {
    return this._language;
  }

  /**
   * set code language
   * @param {string} [language=''] - code language
   * @memberof CodeBlockEditor
   */
  setLanguage(language = '') {
    this._language = language;
  }

  /**
   * get code text
   * @returns {string} - code text
   * @memberof CodeBlockEditor
   */
  getEditorCodeText() {
    return this.getValue();
  }

  /**
   * set code text
   * @param {string} [code=''] - code text
   * @memberof CodeBlockEditor
   */
  setEditorCodeText(code = '') {
    this.setValue(code);
  }

  /**
   * refresh. call if codemirror resized
   * @memberof CodeBlockEditor
   */
  refresh() {
    this.cm.refresh();
  }
}

export default CodeBlockEditor;
