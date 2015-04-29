'use strict';

var LayerPopup = require('./layerpopup'),
    Tab = require('./tab');

var POPUP_CONTENT = [
    '<div class="tabSection"></div>',
    '<div class="urlType">',
        '<label for="">Image URL</label>',
        '<input type="text" class="imageUrlInput" />',
    '</div>',
    '<form enctype="multipart/form-data" class="fileType">',
        '<label for="">Image File</label>',
        '<input type="file" class="imageFileInput" />',
    '</form>',
    '<label for="url">Alt Text</label>',
    '<input type="text" class="altTextInput" />',
    '<div class="buttonSection">',
        '<button class="okButton">OK</button>',
        '<button class="closeButton">Cancel</button>',
    '</div>'
];

/**
 * PopupAddImage
 * It implements a Image Add Popup
 * @exports AddImage
 * @extends {LayerPopup}
 * @constructor
 * @class
 */
var PopupAddImage = LayerPopup.extend(/** @lends PopupAddImage.prototype */{
    title: 'Add Image',
    className: 'popupAddImage neditor-popup',
    $content: $(POPUP_CONTENT.join('')),
    init: function PopupAddImage(options) {
        LayerPopup.call(this, options);

        this.eventManager = options.eventManager;

        this.render();

        this._bindContentEvent();
        this._linkWithEventManager();
        this._initApplyImageBindContext();
    },
    _bindContentEvent: function() {
        var self = this;

        this.on('click', '.okButton', function() {
            self.trigger('okButtonClicked', this);
            self.hide();
        });

        this.on('click', '.closeButton', function() {
            self.trigger('closeButtonClicked', this);
            self.hide();
        });

        this.on('shown', function() {
            self.$el.find('.imageUrlInput').focus();
        });

        this.on('hidden', function() {
            self.resetInputs();
        });
    },
    _linkWithEventManager: function() {
        var self = this;

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
                self.eventManager.emit('addImageFileHook', self._getImageFileForm(), self.applyImage);
            }
        });
    },
    _initApplyImageBindContext: function() {
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
    },
    _isUrlType: function() {
        return !!this.$el.find('.imageUrlInput').val();
    },
    /**
     * _renderContent
     * @override
     */
    _renderContent: function() {
        var $popup = this.$el;

        LayerPopup.prototype._renderContent.call(this);

        this.$body.find('.tabSection').append(new Tab({
            initName: 'URL',
            items: ['URL', 'File'],
            sections: [$popup.find('.urlType'), $popup.find('.fileType')]
        }).$el);
    },
    _getImageInfoWithGivenUrl: function(imageUrl) {
        var altText = this.$el.find('.altTextInput').val();

        return this._makeImageInfo(imageUrl, altText);
    },
    _getImageInfo: function() {
        var imageUrl = this.$el.find('.imageUrlInput').val(),
            altText = this.$el.find('.altTextInput').val();

        return this._makeImageInfo(imageUrl, altText);
    },
    _makeImageInfo: function(url, alt) {
        return {
            imageUrl: url,
            altText: alt
        };
    },
    _getImageFileForm: function() {
        return this.$el.find('form');
    },
    resetInputs: function() {
        this.$el.find('input').val('');
    }
});

module.exports = PopupAddImage;
