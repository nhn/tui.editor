/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
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
 * @param {object} options.openerCssQuery
 * @param {object} options.closerCssQuery
 * @param {object} options.$el
 * @param {object} options.content
 * @param {object} options.textContent
 * @param {object} options.title
 * @param {object} options.$target
 */
var Layerpopup = util.defineClass({
    layoutTemplate: LAYOUT_TEMPLATE.join(''),
    init: function Layerpopup(options) {
        options = util.extend({}, options);

        this._setId();
        this._initTarget(options);
        this._initExternalPopupHtmlIfNeed(options);
        this._initCloserOpener(options);
        this._initContent(options);
        this._initTitle(options);
        this._initClassName(options);
    },
    _initTarget: function(options) {
        this.$target = options.$target || $('body');
    },
    _initExternalPopupHtmlIfNeed: function(options) {
        if (options.$el) {
            this.$el = options.$el;
            this._isExternalHtmlUse = true;
        }
    },
    _initCloserOpener: function(options) {
        if (options.openerCssQuery) {
            this.openerCssQuery = options.openerCssQuery;
        }

        if (options.closerCssQuery) {
            this.closerCssQuery = options.closerCssQuery;
        }
    },
    _initContent: function(options) {
        if (options.content) {
            this.$content = $(options.content);
            this.$content.css('display', 'block');
        } else if (options.textContent) {
            this.$content = options.textContent;
        }
    },
    _initTitle: function(options) {
        if (options.title) {
            this.title = options.title;
        }
    },
    _initClassName: function(options) {
        if (options.className) {
            this.className = options.className;
        }
    },
    render: function() {
        this._renderLayout();
        this._renderTitle();
        this._renderContent();

        this._attachPopupEvent();
    },
    _renderLayout: function() {
        if (!this._isExternalHtmlUse) {
            this.$el = $(this.layoutTemplate);
            this.$el.addClass(this.className);
            this.hide();
            this.$target.append(this.$el);
            this.$body = this.$el.find(this._getFullClassName('body'));
        } else {
            this.hide();
        }
    },
    _renderContent: function() {
        if (!this._isExternalHtmlUse) {
            this.setContent(this.$content);
        }
    },
    _renderTitle: function() {
        if (!this._isExternalHtmlUse) {
            this.setTitle(this.title);
        }
    },
    _getFullClassName: function(lastName) {
        return '.' + CLASS_PREFIX + lastName;
    },
    _attachOpenerCloserEvent: function() {
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
    },
    _detachOpenerCloserEvent: function() {
        if (this.openerCssQuery) {
            $(this.openerCssQuery).off('.' + this._getId());
        }

        if (this.closerCssQuery) {
            $(this.closerCssQuery).off('.' + this._getId());
        }
    },
    _attachPopupControlEvent: function() {
        var self = this;

        this.on('click', this._getFullClassName('closeButton'), function() {
            self.hide();
        });
    },
    _detachPopupEvent: function() {
        this.off();
        this._detachOpenerCloserEvent();
    },
    _attachPopupEvent: function() {
        this._attachPopupControlEvent();
        this._attachOpenerCloserEvent();
    },
    _setId: function() {
        this._id = _id;
        _id += 1;
    },
    _getId: function() {
        return this._id;
    },
    setContent: function($content) {
        this.$body.empty();
        this.$body.append($content);
    },
    setTitle: function(title) {
        var $title = this.$el.find(this._getFullClassName('title'));

        $title.empty();
        $title.append(title);
    },
    hide: function() {
        this.$el.css('display', 'none');
        this._isShow = false;
        this.trigger('hidden', this);
    },
    show: function() {
        this.$el.css('display', 'block');
        this._isShow = true;
        this.trigger('shown', this);
    },
    isShow: function() {
        return this._isShow;
    },
    remove: function() {
        this.trigger('remove', this);
        this._detachPopupEvent();

        this.$el.empty();
        this.$el.remove();
    },
    on: function() {
        this.$el.on.apply(this.$el, arguments);
    },
    off: function() {
        this.$el.off.apply(this.$el, arguments);
    },
    trigger: function() {
        this.$el.trigger.apply(this.$el, arguments);
    }
});

Layerpopup.popupfy = function(options) {
    var popup = new Layerpopup(options);
    popup.render();

    return popup;
};

Layerpopup.extend = function(props) {
    var Child = util.defineClass(this, props);
    Child.extend = Layerpopup.extend;
    return Child;
};

Layerpopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = Layerpopup;
