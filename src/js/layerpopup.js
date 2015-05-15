/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var _id = 0;

var CLASS_PREFIX = 'nepopup-';

var LAYOUT_TEMPLATE = [
    '<div class="' + CLASS_PREFIX + 'wrapper">',
        '<div class="' + CLASS_PREFIX + 'header">',
            '<span class="' + CLASS_PREFIX + 'title"></span>',
            '<button class="' + CLASS_PREFIX + 'closeButton">x</button>',
        '</div>',
        '<div class="' + CLASS_PREFIX + 'body"></div>',
    '</div>'
];

/**
 * Layerpopup
 * @exports Layerpopup
 * @extends {}
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
function Layerpopup(options) {
    options = util.extend({}, options);

    this._setId();
    this._initTarget(options);
    this._initExternalPopupHtmlIfNeed(options);
    this._initCloserOpener(options);
    this._initContent(options);
    this._initTitle(options);
    this._initClassName(options);
}

Layerpopup.prototype.layoutTemplate = LAYOUT_TEMPLATE.join('');

Layerpopup.prototype._initTarget = function(options) {
    this.$target = options.$target || $('body');
};

Layerpopup.prototype._initExternalPopupHtmlIfNeed = function(options) {
    if (options.$el) {
        this.$el = options.$el;
        this._isExternalHtmlUse = true;
    }
};

Layerpopup.prototype._initCloserOpener = function(options) {
    if (options.openerCssQuery) {
        this.openerCssQuery = options.openerCssQuery;
    }

    if (options.closerCssQuery) {
        this.closerCssQuery = options.closerCssQuery;
    }
};

Layerpopup.prototype._initContent = function(options) {
    if (options.content) {
        this.$content = $(options.content);
        this.$content.css('display', 'block');
    } else if (options.textContent) {
        this.$content = options.textContent;
    }
};

Layerpopup.prototype._initTitle = function(options) {
    if (options.title) {
        this.title = options.title;
    }
};

Layerpopup.prototype._initClassName = function(options) {
    if (options.className) {
        this.className = options.className;
    }
};

Layerpopup.prototype.render = function() {
    this._renderLayout();
    this._renderTitle();
    this._renderContent();

    this._attachPopupEvent();
};

Layerpopup.prototype._renderLayout = function() {
    if (!this._isExternalHtmlUse) {
        this.$el = $(this.layoutTemplate);
        this.$el.addClass(this.className);
        this.hide();
        this.$target.append(this.$el);
        this.$body = this.$el.find(this._getFullClassName('body'));
    } else {
        this.hide();
    }
};

Layerpopup.prototype._renderContent = function() {
    if (!this._isExternalHtmlUse) {
        this.setContent(this.$content);
    }
};

Layerpopup.prototype._renderTitle = function() {
    if (!this._isExternalHtmlUse) {
        this.setTitle(this.title);
    }
};

Layerpopup.prototype._getFullClassName = function(lastName) {
    return '.' + CLASS_PREFIX + lastName;
};

Layerpopup.prototype._attachOpenerCloserEvent = function() {
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

Layerpopup.prototype._detachOpenerCloserEvent = function() {
    if (this.openerCssQuery) {
        $(this.openerCssQuery).off('.' + this._getId());
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).off('.' + this._getId());
    }
};

Layerpopup.prototype._attachPopupControlEvent = function() {
    var self = this;

    this.on('click', this._getFullClassName('closeButton'), function() {
        self.hide();
    });
};

Layerpopup.prototype._detachPopupEvent = function() {
    this.off();
    this._detachOpenerCloserEvent();
};

Layerpopup.prototype._attachPopupEvent = function() {
    this._attachPopupControlEvent();
    this._attachOpenerCloserEvent();
};

Layerpopup.prototype._setId = function() {
    this._id = _id;
    _id += 1;
};

Layerpopup.prototype._getId = function() {
    return this._id;
};

Layerpopup.prototype.setContent = function($content) {
    this.$body.empty();
    this.$body.append($content);
};

Layerpopup.prototype.setTitle = function(title) {
    var $title = this.$el.find(this._getFullClassName('title'));

    $title.empty();
    $title.append(title);
};

Layerpopup.prototype.hide = function() {
    this.$el.css('display', 'none');
    this._isShow = false;
    this.trigger('hidden', this);
};

Layerpopup.prototype.show = function() {
    this.$el.css('display', 'block');
    this._isShow = true;
    this.trigger('shown', this);
};

Layerpopup.prototype.isShow = function() {
    return this._isShow;
};

Layerpopup.prototype.remove = function() {
    this.trigger('remove', this);
    this._detachPopupEvent();

    this.$el.empty();
    this.$el.remove();
};

Layerpopup.prototype.on = function() {
    this.$el.on.apply(this.$el, arguments);
};

Layerpopup.prototype.off = function() {
    this.$el.off.apply(this.$el, arguments);
};

Layerpopup.prototype.trigger = function() {
    this.$el.trigger.apply(this.$el, arguments);
};

Layerpopup.factory = function(options) {
    var popup = new Layerpopup(options);
    popup.render();
    return popup;
};

Layerpopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = Layerpopup;
