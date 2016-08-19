/**
 * @fileoverview Implements PopupAddImage
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


var LayerPopup = require('./layerpopup'),
    Tab = require('./tab');

var util = tui.util;

/* eslint-disable indent */
var POPUP_CONTENT = [
    '<div class="te-tab-section"></div>',
    '<div class="te-url-type">',
        '<label for="">이미지 URL</label>',
        '<input type="text" class="te-image-url-input" />',
    '</div>',
    '<form enctype="multipart/form-data" class="te-file-type">',
        '<label for="">이미지 선택</label>',
        '<input type="file" class="te-image-file-input" accept="image/*" />',
    '</form>',
    '<label for="url">설명</label>',
    '<input type="text" class="te-alt-text-input" />',
    '<div class="te-button-section">',
        '<button type="button" class="te-ok-button">삽입</button>',
        '<button type="button" class="te-close-button">취소</button>',
    '</div>'
].join('');
/* eslint-enable indent */

/**
 * PopupAddImage
 * It implements a Image Add Popup
 * @exports PopupAddImage
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddImage(options) {
    options = util.extend({
        title: '이미지 삽입',
        className: 'te-popup-add-image tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.eventManager = options.eventManager;

    this.render();

    this._bindContentEvent();
    this._linkWithEventManager();
    this._initApplyImageBindContext();
}

PopupAddImage.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddImage.prototype._bindContentEvent = function() {
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
        self.$el.find('.te-image-url-input').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });

    this.tab.on('itemClick', function() {
        self.resetInputs();
    });

    this.on('change .te-image-file-input', function() {
        var filename = self.$el.find('.te-image-file-input').val().split('\\').pop();
        self.$el.find('.te-alt-text-input').val(filename);
    });
};

PopupAddImage.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('focus', function() {
        self.hide();
    });

    this.eventManager.listen('openPopupAddImage', function() {
        self.eventManager.emit('closeAllPopup');
        self.show();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        if (self._isUrlType()) {
            self.applyImage();
        } else {
            self._preAltValue = self.$el.find('.te-alt-text-input').val();
            self.eventManager.emit('addImageBlobHook',
                                    self.$el.find('.te-image-file-input')[0].files[0],
                                    self.applyImage);
        }
    });
};

PopupAddImage.prototype._initApplyImageBindContext = function() {
    var self = this;

    this.applyImage = function(url) {
        var info;

        if (url) {
            info = self._getImageInfoWithGivenUrl(url);
        } else {
            info = self._getImageInfo();
        }

        self.eventManager.emit('command', 'AddImage', info);
        self.hide();
    };
};

PopupAddImage.prototype._isUrlType = function() {
    return !!this.$el.find('.te-image-url-input').val();
};

/**
 * _renderContent
 * @override
 */
PopupAddImage.prototype._renderContent = function() {
    var $popup = this.$el;

    LayerPopup.prototype._renderContent.call(this);

    this.tab = new Tab({
        initName: 'File',
        items: ['File', 'URL'],
        sections: [$popup.find('.te-file-type'), $popup.find('.te-url-type')]
    });

    this.$body.find('.te-tab-section').append(this.tab.$el);
};

PopupAddImage.prototype._getImageInfoWithGivenUrl = function(imageUrl) {
    var altText = this._preAltValue;
    this._preAltValue = '';
    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._getImageInfo = function() {
    var imageUrl = this.$el.find('.te-image-url-input').val(),
        altText = this.$el.find('.te-alt-text-input').val();

    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._makeImageInfo = function(url, alt) {
    return {
        imageUrl: url,
        altText: alt
    };
};

PopupAddImage.prototype._getImageFileForm = function() {
    return this.$el.find('form');
};

PopupAddImage.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddImage;
