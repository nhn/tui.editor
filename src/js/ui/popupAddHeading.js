/**
 * @fileoverview Implements PopupAddTable
 * @author Minho choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LayerPopup from './layerpopup';
import i18n from '../i18n';

const util = tui.util;

/**
 * PopupHeading
 * It implements Popup to add headings
 * @exports PopupAddHeading
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 * @ignore
 */
function PopupAddHeading(options) {
    /* eslint-disable indent */
    const POPUP_CONTENT = [
        '<ul>',
            `<li data-value="1" data-type="Heading"><h1>${i18n.get('Heading')} 1</h1></li>`,
            `<li data-value="2" data-type="Heading"><h2>${i18n.get('Heading')} 2</h2></li>`,
            `<li data-value="3" data-type="Heading"><h3>${i18n.get('Heading')} 3</h3></li>`,
            `<li data-value="4" data-type="Heading"><h4>${i18n.get('Heading')} 4</h4></li>`,
            `<li data-value="5" data-type="Heading"><h5>${i18n.get('Heading')} 5</h5></li>`,
            `<li data-value="6" data-type="Heading"><h6>${i18n.get('Heading')} 6</h6></li>`,
            `<li data-type="Paragraph"><div>${i18n.get('Paragraph')}</div></li>`,
        '</ul>'
    ].join('');
    /* eslint-enable indent */

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
        self.eventManager.emit('command', $(this).data('type'), $(this).data('value'));
    });
    /* eslint-enable prefer-arrow-callback*/
};

module.exports = PopupAddHeading;
