/**
 * @fileoverview Implements UI code block gadget
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import BlockOverlay from './blockOverlay';

const EVENT_LANGUAGE_CHANGED = 'language-changed';
const GADGET_WIDTH = 250;
const GADGET_HEIGHT = 30;

/**
 * Class CodeBlockGadget
 * @extends {BlockOverlay}
 */
class CodeBlockGadget extends BlockOverlay {
  /**
   * Creates an instance of CodeBlockGadget.
   * @param {Object} options - options
   * @param {EventManager} options.eventManager - event manager instance
   * @param {HTMLElement} options.container - container element
   * @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
   * @memberof CodeBlockGadget
   */
  constructor({eventManager, container, wysiwygEditor}) {
    super({
      eventManager,
      container,
      attachedSelector: 'pre'
    });

    this._wysiwygEditor = wysiwygEditor;
    this._popupCodeBlockLanguages = null;

    this._initDOM();
    this._initDOMEvent();
  }

  _initDOM() {
    this.$el.addClass('code-block-header');
    this._$languageLabel = $('<span>text</span>');
    this.$el.append(this._$languageLabel);
    this._$buttonOpenModalEditor = $(`<button type="button">Editor</button>`);
    this.$el.append(this._$buttonOpenModalEditor);
  }

  _initDOMEvent() {
    this._$buttonOpenModalEditor.on('click', () => this._openPopupCodeBlockEditor());
  }

  _openPopupCodeBlockEditor() {
    this._eventManager.emit('openPopupCodeBlockEditor', this.getAttachedElement());
  }

  _updateLanguage() {
    const attachedElement = this.getAttachedElement();
    const language = attachedElement ? attachedElement.getAttribute('data-language') : null;

    this._$languageLabel.text(language ? language : 'text');
  }

  /**
   * update gadget position
   * @memberof CodeBlockGadget
   * @protected
   * @override
   */
  syncLayout() {
    const $attachedElement = $(this.getAttachedElement());
    const offset = $attachedElement.offset();

    offset.left = offset.left + ($attachedElement.outerWidth() - GADGET_WIDTH);

    this.$el.offset(offset);
    this.$el.height(GADGET_HEIGHT);
    this.$el.width(GADGET_WIDTH);
  }

  /**
   * on show
   * @memberof CodeBlockGadget
   * @protected
   * @override
   */
  onShow() {
    super.onShow();

    this._onAttachedElementChange = () => this._updateLanguage();
    $(this.getAttachedElement()).on(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

    this._updateLanguage();
  }

  /**
   * on hide
   * @memberof CodeBlockGadget
   * @protected
   * @override
   */
  onHide() {
    $(this.getAttachedElement()).off(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

    super.onHide();
  }
}

export default CodeBlockGadget;
