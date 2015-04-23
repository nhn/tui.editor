'use strict';

var LayerPopup = require('./layerpopup');

var POPUP_CONTENT = [
    '<label for="linkText">Image URL</label>',
    '<input type="text" class="imageUrlInput" />',
    '<label for="url">Alt Text</label>',
    '<input type="text" class="altTextInput" />',
    '<div class="buttonSection">',
    '<button class="okButton">OK</button>',
    '<button class="closeButton">Cancel</button>',
    '</div>'
];

var PopupAddImage = LayerPopup.extend({
    title: 'Add Image',
    className: 'popupAddImage neditor-popup',
    $content: $(POPUP_CONTENT.join('')),
    init: function PopupAddImage(options) {
        LayerPopup.call(this, options);

        this.render();
        this._bindContentEvent();
        this._linkWithEventManager(options.eventManager);
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
    },
    _linkWithEventManager: function(eventManager) {
        var self = this;

        eventManager.listen('openPopupAddImage', function() {
            self.show();
        });

        this.on('okButtonClicked', function() {
            eventManager.emit('command', 'AddImage', self.getValue());
        });
    },
    getValue: function() {
        return {
            imageUrl: this.$el.find('.imageUrlInput').val(),
            altText: this.$el.find('.altTextInput').val()
        };
    }
});

module.exports = PopupAddImage;
