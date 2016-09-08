/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import UIController from './uicontroller';
import i18n from '../i18n';

const util = tui.util;

const TYPE = {
    MARKDOWN: 'markdown',
    WYSIWYG: 'wysiwyg'
};

/**
 * ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports ModeSwitch
 * @augments UIController
 * @constructor
 * @class
 * @param {number} initialType initial type of editor
 */
function ModeSwitch(initialType) {
    UIController.call(this, {
        tagName: 'div',
        className: 'te-mode-switch'
    });

    this._render();
    this._switchType(util.isExisty(initialType) ? initialType : TYPE.MARKDOWN);
}

ModeSwitch.prototype = util.extend(
    {},
    UIController.prototype
);

ModeSwitch.prototype._render = function() {
    this.$buttons = {};
    this.$buttons.markdown
        = $(`<button class="te-switch-button markdown" type="button">${i18n.get('Markdown')}</button>`);
    this.$buttons.wysiwyg
        = $(`<button class="te-switch-button wysiwyg" type="button">${i18n.get('WYSIWYG')}</button>`);
    this.$el.append(this.$buttons.markdown);
    this.$el.append(this.$buttons.wysiwyg);

    this.attachEvents({
        'click .markdown': '_changeMarkdown',
        'click .wysiwyg': '_changeWysiwyg'
    });
};

ModeSwitch.prototype._changeMarkdown = function() {
    this._switchType(TYPE.MARKDOWN);
};

ModeSwitch.prototype._changeWysiwyg = function() {
    this._switchType(TYPE.WYSIWYG);
};

ModeSwitch.prototype._setActiveButton = function(type) {
    util.forEach(this.$buttons, $button => {
        $button.removeClass('active');
    });
    this.$buttons[type].addClass('active');
};

ModeSwitch.prototype._switchType = function(type) {
    if (this.type === type) {
        return;
    }

    this.type = type;
    this._setActiveButton(type);
    this.trigger('modeSwitched', this.type);
};

ModeSwitch.TYPE = TYPE;

module.exports = ModeSwitch;
