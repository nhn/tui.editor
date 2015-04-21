'use strict';

var LayerPopup = require('./layerpopup'),
    UIController = require('./uicontroller');

var ADDLINK_CONTENT = [
    '<label for="linkText">Link Text</lable>',
    '<input type="text" id="linkText" />',
    '<label for="url">URL</label>',
    '<input type="text" id="url" />',
    '<button class="okButton" />',
    '<button class="closeButton" />'
];

var PopupAddLinkContent = UIController.extend({
    contentHTML: ADDLINK_CONTENT.join(''),
    init: function() {
        UIController.call(this);
    },
    render: function() {
        this.$el.html(this.contentHTML);

        return this;
    }
});

var PopupAddLink = LayerPopup.extend({
    className: 'popupAddLink',
    init: function PopupAddLink(options) {
        LayerPopup.apply(this, options);

        this.addLinkContent = new PopupAddLinkContent();

        this._renderPopup();
    },
    _renderPopup: function() {
        this.setContent(this.addLinkContent.render().$el);
    }
});

module.exports = PopupAddLink;
