/**
 * @fileoverview Implements popup code block editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

import LayerPopup from './layerpopup';
import ScrollSyncSplit from './scrollSyncSplit';
import CodeBlockEditor from '../codeBlockEditor';
import CodeBlockPreview from '../codeBlockPreview';
import CodeBlockLanguagesCombo from './codeBlockLanguagesCombo';
import i18n from '../i18n';

const CLASS_PREFIX = 'popup-editor-';
const CLASS_OK_BUTTON = 'te-ok-button';
const CLASS_CLOSE_BUTTON = 'te-close-button';
const CLASS_POPUP_CLOSE_BUTTON = 'tui-popup-close-button';
const TEMPLATE_HEADER_BUTTONS = `
    <button type="button" class="${CLASS_PREFIX}toggle-scroll"></button>
    <button type="button" class="${CLASS_PREFIX}toggle-preview"></button>
    <button type="button" class="${CLASS_PREFIX}toggle-fit"></button>
    <button type="button" class="${CLASS_POPUP_CLOSE_BUTTON}"></button>
`;

/**
 * Class popup code block editor
 * @extends {LayerPopup}
 */
class PopupCodeBlockEditor extends LayerPopup {
  /**
   * Creates an instance of PopupCodeBlockEditor.
   * @param {LayerPopupOption} options - layer popup option
   * @memberof PopupCodeBlockEditor
   */
  constructor(options) {
    const TEMPLATE_CONTENT = `
            <div class="${CLASS_PREFIX}body"></div>
            <div class="te-button-section">
                <button type="button" class="${CLASS_OK_BUTTON}">${i18n.get('OK')}</button>
                <button type="button" class="${CLASS_CLOSE_BUTTON}">${i18n.get('Cancel')}</button>
            </div>
        `;
    options = util.extend({
      header: true,
      title: 'CodeBlock Editor',
      content: TEMPLATE_CONTENT,
      className: 'tui-popup-code-block-editor',
      headerButtons: TEMPLATE_HEADER_BUTTONS,
      modal: true
    }, options);
    super(options);
  }

  /**
   * init instance.
   * store properties & prepare before initialize DOM
   * @param {LayerPopupOption} options - layer popup options
   * @memberof PopupCodeBlockEditor
   * @protected
   * @override
   */
  _initInstance(options) {
    super._initInstance(options);

    this.eventManager = options.eventManager;
    this.convertor = options.convertor;
  }

  /**
   * initialize DOM, render popup
   * @memberof PopupCodeBlockEditor
   * @protected
   * @override
   */
  _initDOM(options) {
    super._initDOM(options);

    const el = this.$el.get(0);
    this._body = el.querySelector(`.${CLASS_PREFIX}body`);
    this._toggleFitButton = el.querySelector(`.${CLASS_PREFIX}toggle-fit`);
    this._togglePreviewButton = el.querySelector(`.${CLASS_PREFIX}toggle-preview`);
    this._toggleScrollButton = el.querySelector(`.${CLASS_PREFIX}toggle-scroll`);
    this._okButton = el.querySelector(`.${CLASS_OK_BUTTON}`);
    this._closeButton = el.querySelector(`.${CLASS_CLOSE_BUTTON}`);

    this._codeMirrorWrapper = this._createCodeBlockEditor();
    this._previewWrapper = this._createPreview();
    this._scrollSyncSplit = new ScrollSyncSplit(this._body, this._codeMirrorWrapper, this._previewWrapper);

    this._updateFitWindowButton();
    this._updatePreviewButton();
    this._updateScrollButton();

    this._codeBlockLanguagesCombo = this._createCodeBlockLanguagesCombo();
  }

  /**
   * bind DOM events
   * @memberof PopupCodeBlockEditor
   * @protected
   * @override
   */
  _initDOMEvent() {
    super._initDOMEvent();

    this.on('scroll', ev => ev.preventDefault());
    this.on(`click .${CLASS_PREFIX}toggle-fit`, () => this._toggleFitToWindow());
    this.on(`click .${CLASS_PREFIX}toggle-preview`, () => this._togglePreview());
    this.on(`click .${CLASS_PREFIX}toggle-scroll`, () => this._toggleScroll());
    this.on(`click .${CLASS_OK_BUTTON}`, () => this._save());
    this.on(`click .${CLASS_CLOSE_BUTTON}`, () => this.hide());
    this.on(`click .${CLASS_PREFIX}close`, () => this.hide());
    this.on(`click .${CLASS_PREFIX}editor-wrapper`, ev => {
      if (ev.target === this._codeMirrorWrapper) {
        this._focusEditor(true);
      }
    });
  }

  /**
   * bind editor events
   * @memberof PopupCodeBlockEditor
   * @protected
   * @abstract
   */
  _initEditorEvent() {
    super._initEditorEvent();

    this.eventManager.listen('openPopupCodeBlockEditor', codeBlockElement => {
      this.eventManager.emit('closeAllPopup');
      this.show(codeBlockElement);

      return this;
    });
    this.eventManager.listen('closeAllPopup', this.hide.bind(this));
    this.eventManager.listen('closePopupCodeBlockEditor', this.hide.bind(this));
  }

  _createCodeBlockEditor() {
    const codeMirrorWrapper = document.createElement('div');
    codeMirrorWrapper.classList.add(`${CLASS_PREFIX}editor-wrapper`);

    this._codeBlockEditor = new CodeBlockEditor(codeMirrorWrapper, this.eventManager);

    return codeMirrorWrapper;
  }

  _createPreview() {
    const previewWrapper = document.createElement('div');
    this._codeBlockPreview = new CodeBlockPreview(
      $(previewWrapper),
      this.eventManager,
      this.convertor,
      this._codeBlockEditor
    );

    return previewWrapper;
  }

  _createCodeBlockLanguagesCombo() {
    const titleElement = this.getTitleElement();
    const codeBlockLanguagesCombo = new CodeBlockLanguagesCombo(this.eventManager);

    codeBlockLanguagesCombo.setOnLanguageSelected(selectedLanguage => {
      this._codeBlockEditor.setLanguage(selectedLanguage);
      this._codeBlockEditor.refresh();
      this._focusEditor();
    });

    titleElement.innerHTML = 'CodeBlock Editor';
    titleElement.appendChild(codeBlockLanguagesCombo.getElement());

    return codeBlockLanguagesCombo;
  }

  _updateFitWindowButton() {
    $(this._toggleFitButton).toggleClass('active', this.isFitToWindow());
  }

  _updatePreviewButton() {
    $(this._togglePreviewButton).toggleClass('active', this._scrollSyncSplit.isSplitView());
  }

  _updateScrollButton() {
    if (this._scrollSyncSplit.isSplitView()) {
      this._toggleScrollButton.style.display = 'inline-block';
    } else {
      this._toggleScrollButton.style.display = 'none';
    }
    $(this._toggleScrollButton).toggleClass('active', this._scrollSyncSplit.isScrollSynced());
  }

  _focusEditor(cursorToEnd) {
    this._codeBlockEditor.focus();
    if (cursorToEnd) {
      this._codeBlockEditor.moveCursorToEnd();
    } else {
      this._codeBlockEditor.moveCursorToStart();
    }
  }

  _togglePreview() {
    this._scrollSyncSplit.toggleSplitView();
    this._updatePreviewButton();
    this._updateScrollButton();
    this._codeBlockEditor.refresh();
  }

  _toggleFitToWindow() {
    this.toggleFitToWindow();
    this._updateFitWindowButton();
    this._codeBlockEditor.refresh();
  }

  _toggleScroll() {
    this._scrollSyncSplit.toggleScrollSync();
    this._updateScrollButton();
  }

  /**
   * store code mirror text to wysiwyg code block
   * @memberof PopupCodeBlockEditor
   * @private
   */
  _save() {
    this._codeBlockEditor.save(this._codeBlockElement);
    this.hide();
  }

  /**
   * load code mirror text from wysiwyg code block
   * @param {HTMLElement} codeBlockElement - code block element instance to load code from
   * @private
   * @memberof PopupCodeBlockEditor
   */
  _load(codeBlockElement) {
    this._codeBlockElement = codeBlockElement;
    this._codeBlockEditor.load(codeBlockElement);
    this._codeBlockLanguagesCombo.setLanguage(this._codeBlockEditor.getLanguage());
    this._focusEditor();
    this._codeBlockPreview.refresh();
  }

  /**
   * show popup
   * @param {HTMLElement} codeBlockElement - code block element
   * @memberof PopupCodeBlockEditor
   * @override
   */
  show(codeBlockElement) {
    super.show();

    if (!codeBlockElement) {
      throw new Error('should be called with codeBlockElement');
    }
    this._load(codeBlockElement);
  }

  /**
   * hide popup
   * @memberof PopupCodeBlockEditor
   * @override
   */
  hide() {
    this.setFitToWindow(false);

    if (this._codeBlockEditor) {
      this._codeBlockEditor.clear();
    }
    if (this._codeBlockPreview) {
      this._codeBlockPreview.clear();
    }
    this._codeBlockElement = null;

    super.hide();
  }
}

export default PopupCodeBlockEditor;
