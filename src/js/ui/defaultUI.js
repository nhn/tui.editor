/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

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

const CLASS_TOOLBAR = 'te-toolbar-section';
const CLASS_MARKDOWN_TAB = 'te-markdown-tab-section';
const CLASS_EDITOR = 'te-editor-section';
const CLASS_MODE_SWITCH = 'te-mode-switch-section';
const CONTAINER_TEMPLATE = `
    <div class="tui-editor-defaultUI">
        <div class="${CLASS_TOOLBAR}"></div>
        <div class="${CLASS_MARKDOWN_TAB}"></div>
        <div class="${CLASS_EDITOR}"></div>
        <div class="${CLASS_MODE_SWITCH}"></div>
    </div>
`;

/**
 * Default UI
 * initialize ui instances. toolbar, popups
 * @class DefaultUI
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
         * @member {string}
         */
        this.name = 'default';

        /**
         * Toolbar instance
         * @member {Toolbar}
         */
        this.toolbar = null;

        /**
         * Toolbar wrapper element
         * @member {jQuery}
         */
        this.$el = null;

        this._editor = editor;
        this._initialEditType = editor.options.initialEditType;

        this._init(editor.options.el);
        this._initEvent();
    }

    _init(container) {
        this.$el = $(CONTAINER_TEMPLATE).appendTo(container);
        this.$el.find(`.${CLASS_EDITOR}`).append(this._editor.layout.getEditorEl());

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
            initName: 'Editor',
            items: ['Editor', 'Preview'],
            sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
        });
        this._$markdownTabSection = this.$el.find(`.${CLASS_MARKDOWN_TAB}`);
        this._$markdownTabSection.append(this.markdownTab.$el);

        this.markdownTab.on('itemClick', (ev, itemText) => {
            if (itemText === 'Preview') {
                editor.eventManager.emit('previewNeedsRefresh');
            } else {
                editor.getCodeMirror().focus();
            }
        });
    }

    _markdownTabControl() {
        if (this._editor.isMarkdownMode() && this._editor.getCurrentPreviewStyle() === 'tab') {
            this._$markdownTabSection.show();
            this.markdownTab.activate('Editor');
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
            languages: editor.convertor.getCodeBlockManager().getSupportedLanguages()
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

module.exports = DefaultUI;
