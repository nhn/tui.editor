/**
 * @fileoverview default UI
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

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
import domUtils from '../utils/dom';

const CLASS_TOOLBAR = 'te-toolbar-section';
const CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
const CLASS_EDITOR = 'te-editor-section';
const CLASS_MODE_SWITCH = 'te-mode-switch-section';
const CONTAINER_TEMPLATE = [
  '<div class="tui-editor-defaultUI">',
  `<div class="${CLASS_TOOLBAR}"><div class="${CLASS_MARKDOWN_TAB}"></div></div>`,
  `<div class="${CLASS_EDITOR}"></div>`,
  `<div class="${CLASS_MODE_SWITCH}"></div>`,
  '</div>'
].join('');

/**
 * Class DefaultUI
 * @param {ToastUIEditor} editor - editor instance
 */
class DefaultUI {
  /**
   * UI name
   * @type {string}
   */
  name = 'default';

  /**
   * DefaultToolbar wrapper element
   * @type {HTMLElement}
   */
  el;

  /**
   * DefaultToolbar instance
   * @type {DefaultToolbar}
   * @private
   */
  _toolbar;

  /**
   * @type {HTMLElement}
   * @private
   */
  _container;

  /**
   * editor section element
   * @private
   * @type {HTMLElement}
   */
  _editorSection;

  /**
   * editor type ww/md
   * @private
   * @type {string}
   */
  _initialEditType;

  /**
   * editor instance
   * @private
   * @type {ToastUIEditor}
   */
  _editor;

  /**
   * markdown tab section element
   * @private
   * @type {HTMLElement}
   */
  _markdownTabSection;

  /**
   * markdown tab
   * @private
   * @type {Tab}
   */
  _markdownTab;

  /**
   * mode switch instance
   * @private
   * @type {ModeSwitch}
   */
  _modeSwitch;

  /**
   * popup instances
   * @private
   * @type {Array}
   */
  _popups = [];

  constructor(editor) {
    this._editor = editor;
    this._initialEditType = editor.options.initialEditType;

    this._init(editor.options);
    this._initEvent();
  }

  _init({ el: container, toolbarItems, hideModeSwitch }) {
    this.el = domUtils.createElementWith(CONTAINER_TEMPLATE, container);
    this._container = container;
    this._editorSection = this.el.querySelector(`.${CLASS_EDITOR}`);
    this._editorSection.appendChild(this._editor.layout.getEditorEl());

    this._initToolbar(this._editor.eventManager, toolbarItems);
    this._initModeSwitch(this._editor.eventManager, hideModeSwitch);

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
    this.el.querySelector(`.${CLASS_TOOLBAR}`).appendChild(toolbar.el);
  }

  _initModeSwitch(eventManager, hideModeSwitch) {
    const modeSwitchTabBar = this.el.querySelector(`.${CLASS_MODE_SWITCH}`);
    const editType =
      this._initialEditType === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG;
    const modeSwitch = new ModeSwitch(modeSwitchTabBar, editType, eventManager);

    this._modeSwitch = modeSwitch;

    if (hideModeSwitch) {
      modeSwitch.hide();
    }

    modeSwitch.on('modeSwitched', type => this._editor.changeMode(type));
  }

  _initMarkdownTab() {
    const editor = this._editor;

    this._markdownTab = new Tab({
      initName: i18n.get('Write'),
      items: [i18n.get('Write'), i18n.get('Preview')],
      sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
    });
    this._markdownTabSection = this.el.querySelector(`.${CLASS_MARKDOWN_TAB}`);
    this._markdownTabSection.appendChild(this._markdownTab.el);

    this._markdownTab.on('itemClick', itemText => {
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
      css(this._markdownTabSection, { display: 'block' });
      this._markdownTab.activate(i18n.get('Write'));
    } else {
      css(this._markdownTabSection, { display: 'none' });
    }
  }

  _initPopupAddLink() {
    this._popups.push(
      new PopupAddLink({
        target: this.el,
        editor: this._editor
      })
    );
  }

  _initPopupAddImage() {
    this._popups.push(
      new PopupAddImage({
        target: this.el,
        eventManager: this._editor.eventManager
      })
    );
  }

  _initPopupAddTable() {
    this._popups.push(
      new PopupAddTable({
        target: this._toolbar.el,
        eventManager: this._editor.eventManager,
        button: this.el.querySelector('button.tui-table'),
        css: {
          position: 'absolute'
        }
      })
    );
  }

  _initPopupAddHeading() {
    this._popups.push(
      new PopupAddHeading({
        target: this._toolbar.el,
        eventManager: this._editor.eventManager,
        button: this.el.querySelector('button.tui-heading'),
        css: {
          position: 'absolute'
        }
      })
    );
  }

  _initPopupTableUtils() {
    this._editor.eventManager.listen('contextmenu', ev => {
      if (domUtils.parents(ev.data.target, '[contenteditable=true] table').length > 0) {
        ev.data.preventDefault();
        this._editor.eventManager.emit('openPopupTableUtils', ev.data);
      }
    });

    this._popups.push(
      new PopupTableUtils({
        target: this.el,
        eventManager: this._editor.eventManager
      })
    );
  }

  _initPopupCodeBlockLanguages() {
    const editor = this._editor;

    this._popups.push(
      new PopupCodeBlockLanguages({
        target: this.el,
        eventManager: editor.eventManager,
        languages: editor.codeBlockLanguages
      })
    );
  }

  _initPopupCodeBlockEditor() {
    this._popups.push(
      new PopupCodeBlockEditor({
        target: this.el,
        eventManager: this._editor.eventManager,
        convertor: this._editor.convertor,
        languages: this._editor.codeBlockLanguages
      })
    );
  }

  /**
   * get toolbar instance
   * @returns {Toolbar} - toolbar instance
   */
  getToolbar() {
    return this._toolbar;
  }

  /**
   * set toolbar instance
   * @param {Toolbar} toolbar - toolbar
   */
  setToolbar(toolbar) {
    this._toolbar.destroy();
    this._toolbar = toolbar;
  }

  /**
   * get mode switch instance
   * @returns {ModeSwitch} - mode switch instance
   */
  getModeSwitch() {
    return this._modeSwitch;
  }

  /**
   * get editor section height
   * @returns {Number} - height of editor section
   */
  getEditorSectionHeight() {
    const clientRect = this._editorSection.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }

  /**
   * get editor height
   * @returns {Number} - height of editor
   */
  getEditorHeight() {
    const clientRect = this._container.getBoundingClientRect();

    return clientRect.bottom - clientRect.top;
  }

  /**
   * get Table Popup
   * @returns {PopupTableUtils} - PopupTableUtils
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
   */
  hide() {
    addClass(this.el, 'te-hide');
  }

  /**
   * show
   */
  show() {
    removeClass(this.el, 'te-hide');
  }

  /**
   * remove
   */
  remove() {
    domUtils.remove(this.el);
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
   */
  createPopup(options) {
    return new LayerPopup(options);
  }
}

export default DefaultUI;
