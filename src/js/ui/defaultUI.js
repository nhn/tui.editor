/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    ModeSwitch = require('./modeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage');

var containerTmpl = [
    '<div class="tui-editor-defaultUI">',
        '<div class="toolbarSection" />',
        '<div class="modeSwitchSection" />',
        '<div class="markdownTabSection" />',
        '<div class="editorContainer"  />',
    '</div>'
].join('');

/**
 * DefaultUI
 * @exports DefaultUI
 * @extends {}
 * @constructor
 * @class
 * @param {ToastUIEditor} editor editor
 */
function DefaultUI(editor) {
    this.$el = $(editor.options.el);
    this.type = editor.options.initialEditType;
    this.editor = editor;

    this.init();
    this._initEvent();
}

DefaultUI.prototype.init = function() {
    this._renderLayout();

    this._initEditorSection();

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();

    this._initMarkdownTab();
};

DefaultUI.prototype._initEditorSection = function() {
    this.$el.find('.editorContainer').append(this.editor.layout.getEditorEl());
};

DefaultUI.prototype._initEvent = function() {
    var self = this;

    this.editor.eventManager.listen('hide', this.hide.bind(this));
    this.editor.eventManager.listen('show', this.show.bind(this));
    this.editor.eventManager.listen('changeMode', function() {
        self.markdownTabControl();
    });

    this.editor.eventManager.listen('changePreviewStyle', function() {
        self.markdownTabControl();
    });
};

DefaultUI.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

DefaultUI.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.editor.eventManager);
    this.$containerEl.find('.toolbarSection').append(this.toolbar.$el);
};

DefaultUI.prototype._initModeSwitch = function() {
    var self = this;

    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$containerEl.find('.modeSwitchSection').append(this.modeSwitch.$el);

    this.modeSwitch.on('modeSwitched', function(ev, info) {
        self.editor.changeMode(info.text);
    });
};

DefaultUI.prototype.markdownTabControl = function() {
    if (this.editor.isMarkdownMode() && this.editor.getCurrentPreviewStyle() === 'tab') {
        this.$containerEl.find('.markdownTabSection').show();
        this.markdownTab.activate('Editor');
    } else {
        this.$containerEl.find('.markdownTabSection').hide();
    }
};

DefaultUI.prototype._initMarkdownTab = function() {
    this.markdownTab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.editor.layout.getMdEditorContainerEl(), this.editor.layout.getPreviewEl()]
    });

    this.$containerEl.find('.markdownTabSection').append(this.markdownTab.$el);
};

DefaultUI.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el.find('.tui-editor'),
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el.find('.tui-editor'),
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype.hide = function() {
    this.$el.find('.tui-editor-defaultUI').addClass('hide');
};

DefaultUI.prototype.show = function() {
    this.$el.find('.tui-editor-defaultUI').removeClass('hide');
};

DefaultUI.prototype.remove = function() {
    this.$el.find('.tui-editor-defaultUI').remove();
};

module.exports = DefaultUI;
