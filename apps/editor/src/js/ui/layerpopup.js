/**
 * @fileoverview Implements LayerPopup
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = tui.util,
    _id = 0,
    CLASS_PREFIX = 'tui-popup-',
    LAYOUT_TEMPLATE = [
        '<div class="' + CLASS_PREFIX + 'header">',
        '<span class="' + CLASS_PREFIX + 'title"></span>',
        '<button class="' + CLASS_PREFIX + 'close-button">x</button>',
        '</div>',
        '<div class="' + CLASS_PREFIX + 'body"></div>'
    ].join('');

/**
 * LayerPopup
 * @exports LayerPopup
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string[]} options.openerCssQuery Css Query list to bind clickevent that open popup
 * @param {string[]} options.closerCssQuery Css Query list to bind clickevent that close popup
 * @param {jQuery} options.$el popup root element
 * @param {jQuery|string} options.content popup content that html string or jQuery element
 * @param {string} options.textContent popup text content
 * @param {string} options.title popup title
 * @param {jQuery} options.$target element to append popup
 */
function LayerPopup(options) {
    options = util.extend({}, options);

    UIController.call(this, {
        tagName: 'div',
        className: CLASS_PREFIX + 'wrapper',
        rootElement: options.$el
    });

    options = util.extend({}, options);

    this._setId();
    this._initTarget(options);
    this._initExternalPopupHtmlIfNeed(options);
    this._initCloserOpener(options);
    this._initContent(options);
    this._initTitle(options);
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

LayerPopup.prototype._initClassName = function(options) {
    if (options.className) {
        this.className = options.className;
    }
};

LayerPopup.prototype.render = function() {
    this._renderLayout();
    this._renderTitle();
    this._renderContent();

    this._attachPopupEvent();
};

LayerPopup.prototype._renderLayout = function() {
    if (!this._isExternalHtmlUse) {
        this.$el.html(LAYOUT_TEMPLATE);
        this.$el.addClass(this.className);
        this.hide();
        this.$target.append(this.$el);
        this.$body = this.$el.find(this._getFullClassName('body'));

        if (this.title === false) {
           this.$el.find(this._getFullClassName('header')).remove();
        }
    } else {
        this.hide();

        if (this.$target) {
            this.$target.append(this.$el);
        }
    }
};

LayerPopup.prototype._renderContent = function() {
    if (!this._isExternalHtmlUse) {
        this.setContent(this.$content);
    }
};

LayerPopup.prototype._renderTitle = function() {
    if (!this._isExternalHtmlUse && this.title !== false) {
        this.setTitle(this.title);
    }
};

LayerPopup.prototype._getFullClassName = function(lastName) {
    return '.' + CLASS_PREFIX + lastName;
};

LayerPopup.prototype._attachOpenerCloserEvent = function() {
    var self = this;

    if (this.openerCssQuery) {
        $(this.openerCssQuery).on('click.' + this._getId(), function() {
            self.show();
        });
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).on('click.' + this._getId(), function() {
            self.hide();
        });
    }
};

LayerPopup.prototype._detachOpenerCloserEvent = function() {
    if (this.openerCssQuery) {
        $(this.openerCssQuery).off('.' + this._getId());
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).off('.' + this._getId());
    }
};

LayerPopup.prototype._attachPopupControlEvent = function() {
    var self = this;

    this.on('click ' + this._getFullClassName('close-button'), function() {
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
    var $title = this.$el.find(this._getFullClassName('title'));

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

LayerPopup.prototype.css = function() {
    this.$el.css.apply(this.$el, arguments);
};

LayerPopup.prototype._initCssStyles = function(options) {
    if (options.css) {
        this.css(options.css);
    }
};

LayerPopup.factory = function(options) {
    var popup = new LayerPopup(options);
    popup.render();
    return popup;
};

LayerPopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = LayerPopup;
