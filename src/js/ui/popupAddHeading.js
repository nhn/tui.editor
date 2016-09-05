/**
 * @fileoverview Implements PopupAddTable
 * @author Minho choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import LayerPopup from './layerpopup';

const util = tui.util;

/* eslint-disable indent */
const POPUP_CONTENT = [
    '<ul>',
        '<li data-value="1"><h1>제목</h1></li>',
        '<li data-value="2"><h2>제목</h2></li>',
        '<li data-value="3"><h3>제목</h3></li>',
        '<li data-value="4"><h4>제목</h4></li>',
        '<li data-value="5"><h5>제목</h5></li>',
        '<li data-value="6"><h6>제목</h6></li>',
    '</ul>'
].join('');
/* eslint-enable indent */

/**
 * PopupHeading
 * It implements Popup to add headings
 * @exports PopupAddHeading
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddHeading(options) {
    options = util.extend({
        title: false,
        className: 'te-heading-add',
        content: POPUP_CONTENT
    }, options);
    LayerPopup.call(this, options);
    this.eventManager = options.eventManager;
    this.$button = options.$button;
    this.render();
    this._linkWithEventManager();
    this._bindEvent();
}

PopupAddHeading.prototype = util.extend(
  {},
  LayerPopup.prototype
);

PopupAddHeading.prototype._linkWithEventManager = function() {
    const self = this;

    this.eventManager.listen('focus', () => {
        self.hide();
    });

    this.eventManager.listen('openHeadingSelect', () => {
        self.eventManager.emit('closeAllPopup');
        self.$el.css({
            'top': self.$button.position().top + self.$button.height() + 5,
            'left': self.$button.position().left
        });
        self.show();
    });

    this.eventManager.listen('closeAllPopup', () => {
        self.hide();
    });
};

PopupAddHeading.prototype._bindEvent = function() {
    const self = this;

    /* eslint-disable prefer-arrow-callback*/
    this.on('click li', /** @this Node */function() {
        self.eventManager.emit('command', 'Heading', $(this).data('value'));
    });
    /* eslint-enable prefer-arrow-callback*/
};

module.exports = PopupAddHeading;
