/**
 * @fileoverview default UI
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import DefaultToolbar from './defaultToolbar';
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
   * UI name
   * @memberof DefaultUI
   * @type {string}
   */
  name = 'default';

  /**
   * DefaultToolbar wrapper element
   * @memberof DefaultUI
   * @type {jQuery}
   */
  $el;

  /**
   * DefaultToolbar instance
   * @memberof DefaultUI
   * @type {DefaultToolbar}
   * @private
   */
  _toolbar;

  /**
   * @memberof DefaultUI
   * @type {HTMLElement}
   * @private
   */
  _container;

  /**
   * editor section element
   * @memberof DefaultUI
   * @private
   * @type {HTMLElement}
   */
  _editorSection;

  /**
   * editor type ww/md
   * @memberof DefaultUI
   * @private
   * @type {string}
   */
  _initialEditType;

  /**
   * editor instance
   * @memberof DefaultUI
   * @private
   * @type {ToastUIEditor}
   */
  _editor;

  /**
   * markdown tab section jQuery element
   * @memberof DefaultUI
   * @private
   * @type {HTMLElement}
   */
  _$markdownTabSection;

  /**
   * markdown tab
   * @memberof DefaultUI
   * @private
   * @type {Tab}
   */
  _markdownTab;

  /**
   * mode switch instance
   * @memberof DefaultUI
   * @private
   * @type {ModeSwitch}
   */
  _modeSwitch;

  /**
   * popup instances
   * @memberof DefaultUI
   * @private
   * @type {Array}
   */
  _popups = [];

  /**
   * Creates an instance of DefaultUI.
   * @param {ToastUIEditor} editor - editor instance
   * @memberof DefaultUI
   */
  constructor(editor) {
    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options);
    this._initEvent();
  }

  _init({
    el: container,
    toolbarItems,
    hideModeSwitch
  }) {
    this.$el = $(CONTAINER_TEMPLATE).appendTo(container);
    this._container = container;
    this._editorSection = this.$el.find(`.${CLASS_EDITOR}`).get(0);
    this._editorSection.appendChild(this._editor.layout.getEditorEl().get(0));

    this._initToolbar(this._editor.eventManager, toolbarItems);
    this._initModeSwitch(hideModeSwitch);

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

  _initToolbar(eventManager, toolbarItems) {
    const toolbar = new DefaultToolbar(eventManager, toolbarItems);
    this._toolbar = toolbar;
    this.$el.find(`.${CLASS_TOOLBAR}`).append(toolbar.$el);
  }

  _initModeSwitch(hideModeSwitch) {
    const modeSwitchTabBar = this.$el.find(`.${CLASS_MODE_SWITCH}`);
    const editType = this._initialEditType === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG;
    const modeSwitch = new ModeSwitch(modeSwitchTabBar, editType);
    this._modeSwitch = modeSwitch;

    if (hideModeSwitch) {
      modeSwitch.hide();
    }

    modeSwitch.on('modeSwitched', (ev, type) => this._editor.changeMode(type));
  }

  _initMarkdownTab() {
    const editor = this._editor;

    this._markdownTab = new Tab({
      initName: i18n.get('Write'),
      items: [i18n.get('Write'), i18n.get('Preview')],
      sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
    });
    this._$markdownTabSection = this.$el.find(`.${CLASS_MARKDOWN_TAB}`);
    this._$markdownTabSection.append(this._markdownTab.$el);

    this._markdownTab.on('itemClick', (ev, itemText) => {
      if (itemText === i18n.get('Preview')) {
        editor.eventManager.emit('previewNeedsRefresh');
        editor.eventManager.emit('changePreviewTabPreview');
        editor.eventManager.emit('closeAllPopup');
      } else {
        editor.getCodeMirror().focus();
        editor.eventManager.emit('changePreviewTabWrite');
      }
    });
  }

  _markdownTabControl() {
    if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
      this._$markdownTabSection.show();
      this._markdownTab.activate(i18n.get('Write'));
    } else {
      this._$markdownTabSection.hide();
    }
  }

  _initPopupAddLink() {
    this._popups.push(new PopupAddLink({
      $target: this.$el,
      editor: this._editor
    }));
  }

  _initPopupAddImage() {
    this._popups.push(new PopupAddImage({
      $target: this.$el,
      eventManager: this._editor.eventManager
    }));
  }

  _initPopupAddTable() {
    this._popups.push(new PopupAddTable({
      $target: this._toolbar.$el,
      eventManager: this._editor.eventManager,
      $button: this.$el.find('button.tui-table'),
      css: {
        'position': 'absolute'
      }
    }));
  }

  _initPopupAddHeading() {
    this._popups.push(new PopupAddHeading({
      $target: this._toolbar.$el,
      eventManager: this._editor.eventManager,
      $button: this.$el.find('button.tui-heading'),
      css: {
        'position': 'absolute'
      }
    }));
  }

  _initPopupTableUtils() {
    this._editor.eventManager.listen('contextmenu', ev => {
      if ($(ev.data.target).parents('[contenteditable=true] table').length > 0) {
        ev.data.preventDefault();
        this._editor.eventManager.emit('openPopupTableUtils', ev.data);
      }
    });

    this._popups.push(new PopupTableUtils({
      $target: this.$el,
      eventManager: this._editor.eventManager
    }));
  }

  _initPopupCodeBlockLanguages() {
    const editor = this._editor;
    this._popups.push(new PopupCodeBlockLanguages({
      $target: this.$el,
      eventManager: editor.eventManager,
      languages: editor.options.codeBlockLanguages
    }));
  }

  _initPopupCodeBlockEditor() {
    this._popups.push(new PopupCodeBlockEditor({
      $target: this.$el,
      eventManager: this._editor.eventManager,
      convertor: this._editor.convertor
    }));
  }

  /**
   * get toolbar instance
   * @returns {Toolbar} - toolbar instance
   * @memberof DefaultUI
   */
  getToolbar() {
    return this._toolbar;
  }

  /**
   * set toolbar instance
   * @param {Toolbar} toolbar - toolbar
   * @memberof DefaultUI
   */
  setToolbar(toolbar) {
    this._toolbar.destroy();
    this._toolbar = toolbar;
  }

  /**
   * get mode switch instance
   * @memberof DefaultUI
   * @returns {ModeSwitch} - mode switch instance
   */
  getModeSwitch() {
    return this._modeSwitch;
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
   * get Table Popup
   * @returns {PopupTableUtils} - PopupTableUtils
   * @memberof DefaultUI
   */
  getPopupTableUtils() {
    let tablePopup;
    this._popups.forEach(popup => {
      if (popup instanceof PopupTableUtils) {
        tablePopup = popup;
      }
    });

    return tablePopup;
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
    this._markdownTab.remove();
    this._modeSwitch.remove();
    this._toolbar.destroy();
    this._popups.forEach(popup => popup.remove());
    this._popups = [];
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
