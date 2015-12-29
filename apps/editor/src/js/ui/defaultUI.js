/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    Layerpopup = require('./layerpopup'),
    ModeSwitch = require('./modeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage'),
    PopupTableUtils = require('./popupTableUtils'),
    PopupAddTable = require('./popupAddTable'),
    PopupAddHeading = require('./popupAddHeading');


var containerTmpl = [
    '<div class="tui-editor-defaultUI">',
        '<div class="te-toolbar-section" />',
        '<div class="te-mode-switch-section" />',
        '<div class="te-markdown-tab-section" />',
        '<div class="te-editor-section"  />',
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
    this.name = 'default';

    this.type = editor.options.initialEditType;
    this.editor = editor;

    this.init(editor.options.el);
    this._initEvent();
}

DefaultUI.prototype.init = function($container) {
    this._renderLayout($container);

    this._initEditorSection();

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();
    this._initPopupAddTable();
    this._initPopupAddHeading();
    this._initPopupTableUtils();

    this._initMarkdownTab();
};

DefaultUI.prototype._initEditorSection = function() {
    this.$el.find('.te-editor-section').append(this.editor.layout.getEditorEl());
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

DefaultUI.prototype._renderLayout = function($container) {
    this.$el = $(containerTmpl).appendTo($container);
};

DefaultUI.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.editor.eventManager);
    this.$el.find('.te-toolbar-section').append(this.toolbar.$el);
};

DefaultUI.prototype._initModeSwitch = function() {
    var self = this;

    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$el.find('.te-mode-switch-section').append(this.modeSwitch.$el);

    this.modeSwitch.on('modeSwitched', function(ev, info) {
        self.editor.changeMode(info.text);
    });
};

DefaultUI.prototype.markdownTabControl = function() {
    if (this.editor.isMarkdownMode() && this.editor.getCurrentPreviewStyle() === 'tab') {
        this.$el.find('.te-markdown-tab-section').show();
        this.markdownTab.activate('Editor');
    } else {
        this.$el.find('.te-markdown-tab-section').hide();
    }
};

DefaultUI.prototype._initMarkdownTab = function() {
    this.markdownTab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.editor.layout.getMdEditorContainerEl(), this.editor.layout.getPreviewEl()]
    });

    this.$el.find('.te-markdown-tab-section').append(this.markdownTab.$el);
};

DefaultUI.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el,
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el,
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype._initPopupAddTable = function() {
    this.popupAddTable = new PopupAddTable({
        $target: this.$el,
        eventManager: this.editor.eventManager,
        $button: this.$el.find('button.tui-table'),
        css: {
            'position': 'absolute'
        }
    });
};

DefaultUI.prototype._initPopupAddHeading = function() {
    this.popupAddHeading = new PopupAddHeading({
        $target: this.$el,
        eventManager: this.editor.eventManager,
        $button: this.$el.find('button.tui-heading'),
        css: {
            'position': 'absolute'
        }
    });
};

DefaultUI.prototype._initPopupTableUtils = function() {
    var self = this;

    this.editor.eventManager.listen('contextmenu', function(ev) {
        if ($(ev.data.target).parents('table').length > 0) {
            ev.data.preventDefault();
            self.editor.eventManager.emit('openPopupTableUtils', ev.data);
        }
    });

    this.popupTableUtils = new PopupTableUtils({
        $target: this.$el,
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype.hide = function() {
    this.$el.addClass('te-hide');
};

DefaultUI.prototype.show = function() {
    this.$el.removeClass('te-hide');
};

DefaultUI.prototype.remove = function() {
    this.$el.remove();
};

DefaultUI.prototype.createPopup = function(options) {
    return Layerpopup.factory(options);
};

module.exports = DefaultUI;
