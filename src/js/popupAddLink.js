'use strict';

var LayerPopup = require('./layerpopup');

var ADDLINK_CONTENT = [
    '<label for="linkText">Link Text</label>',
    '<input type="text" class="linkTextInput" />',
    '<label for="url">URL</label>',
    '<input type="text" class="urlInput" />',
    '<div class="buttonSection">',
    '<button class="okButton">OK</button>',
    '<button class="closeButton">Cancel</button>',
    '</div>'
];

var PopupAddLink = LayerPopup.extend({
    title: 'Add Link',
    className: 'popupAddLink neditor-popup',
    $content: $(ADDLINK_CONTENT.join('')),
    init: function PopupAddLink(options) {
        LayerPopup.call(this, options);
        this.render();
        this._bindContentEvent();
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
    getValue: function() {
        return {
            linkText: this.$el.find('.linkTextInput').val(),
            url: this.$el.find('.urlInput').val()
        };
    }
});

module.exports = PopupAddLink;
