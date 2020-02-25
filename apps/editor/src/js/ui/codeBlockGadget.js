/**
 * @fileoverview Implements UI code block gadget
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import on from 'tui-code-snippet/domEvent/on';
import off from 'tui-code-snippet/domEvent/off';

import BlockOverlay from './blockOverlay';
import domUtils from '../domUtils';

const EVENT_LANGUAGE_CHANGED = 'language-changed';
const GADGET_WIDTH = 250;
const GADGET_HEIGHT = 30;

/**
 * Class CodeBlockGadget
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
 * @ignore
 */
class CodeBlockGadget extends BlockOverlay {
  constructor({ eventManager, container, wysiwygEditor }) {
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
    addClass(this.el, 'code-block-header');

    this._languageLabel = domUtils.createElementWith('<span>text</span>');
    domUtils.append(this.el, this._languageLabel);

    this._buttonOpenModalEditor = domUtils.createElementWith(
      `<button type="button">Editor</button>`
    );
    domUtils.append(this.el, this._buttonOpenModalEditor);

    this._eventManager.emit('removeEditor', () => {
      off(this._buttonOpenModalEditor, 'click');
      this._buttonOpenModalEditor = null;
    });
  }

  _initDOMEvent() {
    on(this._buttonOpenModalEditor, 'click', () => this._openPopupCodeBlockEditor());
  }

  _openPopupCodeBlockEditor() {
    this._eventManager.emit('openPopupCodeBlockEditor', this.getAttachedElement());
  }

  _updateLanguage() {
    const attachedElement = this.getAttachedElement();
    const language = attachedElement ? attachedElement.getAttribute('data-language') : null;

    this._languageLabel.textContent = language ? language : 'text';
  }

  /**
   * update gadget position
   * @protected
   * @override
   */
  syncLayout() {
    const attachedElement = this.getAttachedElement();
    const offset = domUtils.getOffset(attachedElement);
    const outerWidth = domUtils.getOuterWidth(attachedElement);

    offset.left = offset.left + (outerWidth - GADGET_WIDTH);

    domUtils.setOffset(this.el, offset);
    css(this.el, { height: `${GADGET_HEIGHT}px` });
    css(this.el, { width: `${GADGET_WIDTH}px` });
  }

  /**
   * on show
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
   * @protected
   * @override
   */
  onHide() {
    $(this.getAttachedElement()).off(EVENT_LANGUAGE_CHANGED, this._onAttachedElementChange);

    super.onHide();
  }
}

export default CodeBlockGadget;
