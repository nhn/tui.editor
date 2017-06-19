/**
 * @fileoverview Implements LayerPopup
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import UIController from './uicontroller';

const {util} = tui;
const CLASS_PREFIX = 'tui-popup-';
const CLASS_FIT_WINDOW = 'fit-window';
let _id = 0;

const LAYOUT_TEMPLATE_MODELESS =
    `<div class="${CLASS_PREFIX}header">
        <span class="${CLASS_PREFIX}title"></span>
        <div class="${CLASS_PREFIX}header-buttons"></div>
        <button type="button" class="${CLASS_PREFIX}close-button">x</button>
    </div>
    <div class="${CLASS_PREFIX}body"></div>`;

const LAYOUT_TEMPLATE_MODAL =
    `<div class="${CLASS_PREFIX}wrapper">
        <div class="${CLASS_PREFIX}header">
            <span class="${CLASS_PREFIX}title"></span>
            <div class="${CLASS_PREFIX}header-buttons"></div>
            <button type="button" class="${CLASS_PREFIX}close-button">x</button>
        </div>
        <div class="${CLASS_PREFIX}body"></div>
    </div>`;

/**
 * A number, or a string containing a number.
 * @typedef {Object} LayerPopupOption
    * @property {string[]} openerCssQuery - Css Query list to bind clickevent that open popup
    * @property {string[]} closerCssQuery - Css Query list to bind clickevent that close popup
    * @property {jQuery} $el - popup root element
    * @property {jQuery|string} content - popup content that html string or jQuery element
    * @property {string} textContent - popup text content
    * @property {string} title - popup title
    * @property {boolean} header - whether to draw header
    * @property {jQuery} $target - element to append popup
    * @property {boolean} modal - true: modal, false: modeless
    * @property {string} headerButtons - replace header(close) button
 */

/**
 * LayerPopup
 * @exports LayerPopup
 * @augments UIController
 * @constructor
 * @class
 * @param {LayerPopupOption} options - popup option
 * @ignore
 */
function LayerPopup(options) {
    this.options = options = util.extend({}, options);
    const wrapperClass = options.modal ? `${CLASS_PREFIX}modal-background` : `${CLASS_PREFIX}wrapper`;

    UIController.call(this, {
        tagName: 'div',
        className: wrapperClass,
        rootElement: options.$el
    });

    this._setId();
    this._initTarget(options);
    this._initExternalPopupHtmlIfNeed(options);
    this._initCloserOpener(options);
    this._initContent(options);
    this._initTitle(options);
    this._initHeader(options);
    this._initClassName(options);
    this._initCssStyles(options);
}

LayerPopup.prototype = util.extend(
    {},
    UIController.prototype
);

LayerPopup.prototype._initTarget = function(options) {
    this.$target = options.$target || $('body');
};

LayerPopup.prototype._initExternalPopupHtmlIfNeed = function(options) {
    if (options.$el) {
        this.$el = options.$el;
        this._isExternalHtmlUse = true;
    }
};

LayerPopup.prototype._initCloserOpener = function(options) {
    this.openerCssQuery = options.openerCssQuery;
    this.closerCssQuery = options.closerCssQuery;
};

LayerPopup.prototype._initContent = function(options) {
    if (options.content) {
        this.$content = $(options.content);
    } else if (options.textContent) {
        this.$content = options.textContent;
    }
};

LayerPopup.prototype._initTitle = function(options) {
    this.title = options.title;
};

LayerPopup.prototype._initHeader = function({header = true}) {
    this.header = header;
};

LayerPopup.prototype._initClassName = function(options) {
    if (options.className) {
        this.className = options.className;
    }
};

LayerPopup.prototype.render = function() {
    this._renderLayout();
    this._renderTitle();
    this._renderContent();
    this._renderHeaderButtons();

    this._attachPopupEvent();
};

LayerPopup.prototype._renderLayout = function() {
    if (!this._isExternalHtmlUse) {
        const layout = this.options.modal ? LAYOUT_TEMPLATE_MODAL : LAYOUT_TEMPLATE_MODELESS;
        this.$el.html(layout);
        this.$el.addClass(this.className);
        this.hide();
        this.$target.append(this.$el);
        this.$body = this.$el.find(`.${CLASS_PREFIX}body`);

        if (!this.header) {
            this.$el.find(`.${CLASS_PREFIX}header`).remove();
        }
        if (this.options.headerButtons) {
            this.$el.find(`.${CLASS_PREFIX}close-button`).remove();
        }
    } else {
        this.hide();

        if (this.$target) {
            this.$target.append(this.$el);
        }
    }
};

LayerPopup.prototype._renderHeaderButtons = function() {
    const buttons = this.options.headerButtons;
    if (buttons) {
        const $buttonWrapper = this.$el.find(`.${CLASS_PREFIX}header-buttons`);
        $buttonWrapper.append($(buttons));
    }
};

LayerPopup.prototype._renderContent = function() {
    if (!this._isExternalHtmlUse) {
        this.setContent(this.$content);
    }
};

LayerPopup.prototype._renderTitle = function() {
    if (!this._isExternalHtmlUse && util.isExisty(this.title)) {
        this.setTitle(this.title);
    }
};

LayerPopup.prototype._attachOpenerCloserEvent = function() {
    const self = this;

    if (this.openerCssQuery) {
        $(this.openerCssQuery).on(`click.${this._getId()}`, () => {
            self.show();
        });
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).on(`click.${this._getId()}`, () => {
            self.hide();
        });
    }
};

LayerPopup.prototype._detachOpenerCloserEvent = function() {
    if (this.openerCssQuery) {
        $(this.openerCssQuery).off(`.${this._getId()}`);
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).off(`.${this._getId()}`);
    }
};

LayerPopup.prototype._attachPopupControlEvent = function() {
    const self = this;

    this.on(`click .${CLASS_PREFIX}close-button`, () => {
        self.hide();
    });
};

LayerPopup.prototype._detachPopupEvent = function() {
    this.off();
    this._detachOpenerCloserEvent();
};

LayerPopup.prototype._attachPopupEvent = function() {
    this._attachPopupControlEvent();
    this._attachOpenerCloserEvent();
};

LayerPopup.prototype._setId = function() {
    this._id = _id;
    _id += 1;
};

LayerPopup.prototype._getId = function() {
    return this._id;
};

LayerPopup.prototype.setContent = function($content) {
    this.$body.empty();
    this.$body.append($content);
};

LayerPopup.prototype.setTitle = function(title) {
    const $title = this.$el.find(`.${CLASS_PREFIX}title`);

    $title.empty();
    $title.append(title);
};

LayerPopup.prototype.hide = function() {
    this.$el.css('display', 'none');
    this._isShow = false;
    this.trigger('hidden', this);
};

LayerPopup.prototype.show = function() {
    this.$el.css('display', 'block');
    this._isShow = true;
    this.trigger('shown', this);
};

LayerPopup.prototype.isShow = function() {
    return this._isShow;
};

LayerPopup.prototype.remove = function() {
    this.trigger('remove', this);
    this._detachPopupEvent();

    this.$el.empty();
    this.$el.remove();
};

LayerPopup.prototype.css = function(...args) {
    this.$el.css(...args);
};

LayerPopup.prototype._initCssStyles = function(options) {
    if (options.css) {
        this.css(options.css);
    }
};

/**
 * make popup size fit to window
 * @param {boolean} fit - true to make popup fit to window
 * @memberof LayerPopup
 * @protected
 */
LayerPopup.prototype.setFitToWindow = function(fit) {
    this.$el.toggleClass(CLASS_FIT_WINDOW, fit);
};

/**
 * make popup size fit to window
 * @memberof LayerPopup
 * @protected
 * @returns {boolean} - true for fit to window
 */
LayerPopup.prototype.isFitToWindow = function() {
    return this.$el.hasClass(CLASS_FIT_WINDOW);
};

/**
 * toggle size fit to window
 * @memberof LayerPopup
 * @protected
 * @returns {boolean} - true for fit to window
 */
LayerPopup.prototype.toggleFitToWindow = function() {
    const fitToWindow = !this.isFitToWindow();
    this.setFitToWindow(fitToWindow);

    return fitToWindow;
};

LayerPopup.factory = function(options) {
    const popup = new LayerPopup(options);
    popup.render();

    return popup;
};

LayerPopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = LayerPopup;
