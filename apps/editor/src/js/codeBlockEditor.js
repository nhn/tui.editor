/**
 * @fileoverview Implements code block editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CodeMirrorExt from './codeMirrorExt';

/**
 * Class Code Block Editor
 * @param {HTMLElement} el - code block editor container element
 * @param {EventManager} eventManager - event manager
 * @ignore
 */
class CodeBlockEditor extends CodeMirrorExt {
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

      if (lineElement) {
        this._eventManager.emit('requireScrollIntoView', lineElement);
      }
    }, 0);
  }

  /**
   * load code from code block element
   * @param {HTMLElement} codeBlockElement - code block element
   */
  load(codeBlockElement) {
    const el = codeBlockElement.cloneNode(true);

    this.setLanguage(el.getAttribute('data-language') || '');
    this.setEditorCodeText(el.textContent);
  }

  /**
   * save code to code block element
   * @param {HTMLElement} codeBlockElement - code block element
   */
  save(codeBlockElement) {
    codeBlockElement.innerHTML = '';
    codeBlockElement.textContent = this.getEditorCodeText();
    codeBlockElement.setAttribute('data-language', this._language);

    this._eventManager.emit('changeLanguage');
  }

  /**
   * clear code and language
   */
  clear() {
    this.setLanguage('');
    this.setEditorCodeText('');
  }

  /**
   * get code language
   * @returns {string} - code language
   */
  getLanguage() {
    return this._language;
  }

  /**
   * set code language
   * @param {string} [language=''] - code language
   */
  setLanguage(language = '') {
    this._language = language;
  }

  /**
   * get code text
   * @returns {string} - code text
   */
  getEditorCodeText() {
    return this.getValue();
  }

  /**
   * set code text
   * @param {string} [code=''] - code text
   */
  setEditorCodeText(code = '') {
    this.setValue(code);
  }

  /**
   * refresh. call if codemirror resized
   */
  refresh() {
    this.cm.refresh();
  }
}

export default CodeBlockEditor;
