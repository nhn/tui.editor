/**
 * @fileoverview default UI
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import Toolbar from './toolbar';
import Tab from './tab';
import LayerPopup from './layerpopup';
import ModeSwitch from './modeSwitch';
import PopupAddLink from './popupAddLink';
import PopupAddImage from './popupAddImage';
import PopupTableUtils from './popupTableUtils';
import PopupAddTable from './popupAddTable';
import PopupAddHeading from './popupAddHeading';
import PopupCodeBlockLanguages from './popupCodeBlockLanguages';
import PopupCodeBlockEditor from './popupCodeBlockEditor';
import i18n from '../i18n.js';
import tooltip from './tooltip';

const CLASS_TOOLBAR = 'te-toolbar-section';
const CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
const CLASS_EDITOR = 'te-editor-section';
const CLASS_MODE_SWITCH = 'te-mode-switch-section';
const CONTAINER_TEMPLATE = `
    <div class="tui-editor-defaultUI">
        <div class="${CLASS_TOOLBAR}"><div class="${CLASS_MARKDOWN_TAB}"></div></div>
        <div class="${CLASS_EDITOR}"></div>
        <div class="${CLASS_MODE_SWITCH}"></div>
    </div>
`;

/**
 * Class Default UI
 * initialize ui instances. toolbar, popups
 */
class DefaultUI {
  /**
   * Creates an instance of DefaultUI.
   * @param {ToastUIEditor} editor - editor instance
   * @memberof DefaultUI
   */
  constructor(editor) {
    /**
     * UI name
     * @memberof DefaultUI#
     * @public
     * @type {string}
     */
    this.name = 'default';

    /**
     * Toolbar instance
     * @memberof DefaultUI#
     * @type {Toolbar}
     */
    this.toolbar = null;

    /**
     * Toolbar wrapper element
     * @memberof DefaultUI#
     * @type {jQuery}
     */
    this.$el = null;

    /**
     * @memberof DefaultUI#
     * @type {HTMLElement}
     * @private
     */
    this._container = null;

    /**
     * editor section element
     * @memberof DefaultUI#
     * @private
     * @type {HTMLElement}
     */
    this._editorSection = null;

    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options.el);
    this._initEvent();
  }

  _init(container) {
    this._container = container;
    this.$el = $(CONTAINER_TEMPLATE).appendTo(container);
    this._editorSection = this.$el.find(`.${CLASS_EDITOR}`).get(0);
    this._editorSection.appendChild(this._editor.layout.getEditorEl().get(0));

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();
    this._initPopupAddTable();
    this._initPopupAddHeading();
    this._initPopupTableUtils();
    this._initPopupCodeBlockLanguages();
    this._initPopupCodeBlockEditor();

    this._initMarkdownTab();
  }

  _initEvent() {
    this._editor.eventManager.listen('hide', this.hide.bind(this));
    this._editor.eventManager.listen('show', this.show.bind(this));
    this._editor.eventManager.listen('changeMode', this._markdownTabControl.bind(this));
    this._editor.eventManager.listen('changePreviewStyle', this._markdownTabControl.bind(this));
  }

  _initToolbar() {
    this.toolbar = new Toolbar(this._editor.eventManager);
    this.$el.find(`.${CLASS_TOOLBAR}`).append(this.toolbar.$el);
  }

  _initModeSwitch() {
    this._modeSwitch = new ModeSwitch(this._initialEditType === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$el.find(`.${CLASS_MODE_SWITCH}`).append(this._modeSwitch.$el);

    this._modeSwitch.on('modeSwitched', (ev, type) => this._editor.changeMode(type));
  }

  _initMarkdownTab() {
    const editor = this._editor;

    this.markdownTab = new Tab({
      initName: i18n.get('Write'),
      items: [i18n.get('Write'), i18n.get('Preview')],
      sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
    });
    this._$markdownTabSection = this.$el.find(`.${CLASS_MARKDOWN_TAB}`);
    this._$markdownTabSection.append(this.markdownTab.$el);

    this.markdownTab.on('itemClick', (ev, itemText) => {
      if (itemText === i18n.get('Preview')) {
        editor.eventManager.emit('previewNeedsRefresh');
      } else {
        editor.getCodeMirror().focus();
      }
    });
  }

  _markdownTabControl() {
    if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
      this._$markdownTabSection.show();
      this.markdownTab.activate(i18n.get('Write'));
    } else {
      this._$markdownTabSection.hide();
    }
  }

  _initPopupAddLink() {
    this.popupAddLink = new PopupAddLink({
      $target: this.$el,
      editor: this._editor
    });
  }

  _initPopupAddImage() {
    this.popupAddImage = new PopupAddImage({
      $target: this.$el,
      eventManager: this._editor.eventManager
    });
  }

  _initPopupAddTable() {
    this.popupAddTable = new PopupAddTable({
      $target: this.$el,
      eventManager: this._editor.eventManager,
      $button: this.$el.find('button.tui-table'),
      css: {
        'position': 'absolute'
      }
    });
  }

  _initPopupAddHeading() {
    this.popupAddHeading = new PopupAddHeading({
      $target: this.$el,
      eventManager: this._editor.eventManager,
      $button: this.$el.find('button.tui-heading'),
      css: {
        'position': 'absolute'
      }
    });
  }

  _initPopupTableUtils() {
    this._editor.eventManager.listen('contextmenu', ev => {
      if ($(ev.data.target).parents('[contenteditable=true] table').length > 0) {
        ev.data.preventDefault();
        this._editor.eventManager.emit('openPopupTableUtils', ev.data);
      }
    });

    this.popupTableUtils = new PopupTableUtils({
      $target: this.$el,
      eventManager: this._editor.eventManager
    });
  }

  _initPopupCodeBlockLanguages() {
    const editor = this._editor;
    this.popupCodeBlockLanguages = new PopupCodeBlockLanguages({
      $target: this.$el,
      eventManager: editor.eventManager,
      languages: editor.options.codeBlockLanguages
    });
  }

  _initPopupCodeBlockEditor() {
    this.popupCodeBlockEditor = new PopupCodeBlockEditor({
      $target: this.$el,
      eventManager: this._editor.eventManager,
      convertor: this._editor.convertor
    });
  }

  /**
   * get editor section height
   * @returns {Number} - height of editor section
   * @memberof DefaultUI
   */
  getEditorSectionHeight() {
    const clientRect = this._editorSection.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }

  /**
   * get editor height
   * @returns {Number} - height of editor
   * @memberof DefaultUI
   */
  getEditorHeight() {
    const clientRect = this._container.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }

  /**
   * hide
   * @memberof DefaultUI
   */
  hide() {
    this.$el.addClass('te-hide');
  }

  /**
   * show
   * @memberof DefaultUI
   */
  show() {
    this.$el.removeClass('te-hide');
  }

  /**
   * remove
   * @memberof DefaultUI
   */
  remove() {
    this.$el.remove();
    tooltip.hide();
  }

  /**
   * creates popup
   * @param {LayerPopupOption} options - layerPopup options
   * @returns {LayerPopup} - crated layerPopup
   * @memberof DefaultUI
   */
  createPopup(options) {
    return new LayerPopup(options);
  }
}

export default DefaultUI;
