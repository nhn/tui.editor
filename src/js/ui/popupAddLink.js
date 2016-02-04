/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = tui.util;

var POPUP_CONTENT = [
    '<label for="linkText">링크에 표시할 내용</label>',
    '<input type="text" class="te-link-text-input" />',
    '<label for="url">URL</label>',
    '<input type="text" class="te-url-input" />',
    '<div class="te-button-section">',
        '<button type="button" class="te-ok-button">확인</button>',
        '<button type="button" class="te-close-button">취소</button>',
    '</div>'
].join('');

/**
 * PopupAddLink
 * It implements a link Add Popup
 * @exports PopupAddLink
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddLink(options) {
    options = util.extend({
        title: '링크 추가',
        className: 'te-popup-add-link tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager(options.eventManager);
}

PopupAddLink.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddLink.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .te-ok-button', function() {
        self.trigger('okButtonClicked', self);
        self.hide();
    });

    this.on('click .te-close-button', function() {
        self.trigger('closeButtonClicked', self);
        self.hide();
    });

    this.on('shown', function() {
        self.$el.find('.te-link-text-input').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });
};

PopupAddLink.prototype._linkWithEventManager = function(eventManager) {
    var self = this;

    eventManager.listen('focus', function() {
        self.hide();
    });

    eventManager.listen('openPopupAddLink', function() {
        eventManager.emit('closeAllPopup');
        self.show();
    });

    eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        eventManager.emit('command', 'AddLink', self.getValue());
    });
};

PopupAddLink.prototype.getValue = function() {
    return {
        linkText: this.$el.find('.te-link-text-input').val(),
        url: this.$el.find('.te-url-input').val().replace(/\(/g, "%28").replace(/\)/g, "%29")
    };
};

PopupAddLink.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddLink;
