'use strict';

var LayerPopup = require('./layerpopup');

var POPUP_CONTENT = [
    '<label for="">Image URL</label>',
    '<input type="text" class="imageUrlInput" />',
    '<form>',
    '<label for="">Image File</label>',
    '<input type="file" name="imageFile" class="imageFileInput" />',
    '<label for="url">Alt Text</label>',
    '<input type="text" name="altText" class="altTextInput" />',
    '</form>',
    '<div class="buttonSection">',
    '<button class="okButton">OK</button>',
    '<button class="closeButton">Cancel</button>',
    '</div>'
];

/**
 * PopupAddImage
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
            if (self.isUrlType()) {
                self.applyImage(self.getValue());
            } else {
                self.eventManager.emit('addImageFileHook', self.getHookValue(), self.applyImage);
            }
        });
    },
    _initApplyImageBindContext: function() {
        var self = this;

        this.applyImage = function(value) {
            self.eventManager.emit('command', 'AddImage', value);
            self.hide();
        };
    },
    isUrlType: function() {
        return !!this.$el.find('.imageUrlInput').val();
    },
    getValue: function() {
        return {
            imageUrl: this.$el.find('.imageUrlInput').val(),
            altText: this.$el.find('.altTextInput').val()
        };
    },
    getHookValue: function() {
        return this.$el.find('form');
    },
    resetInputs: function() {
        this.$el.find('input').val('');
    }
});

module.exports = PopupAddImage;
