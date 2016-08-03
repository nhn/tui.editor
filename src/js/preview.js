/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LazyRunner = require('./lazyRunner');

/**
 * Preview
 * @exports Preview
 * @class Preview
 * @constructor
 * @param {jQuery} $el Container element for preview
 * @param {EventManager} eventManager Event manager instance
 * @param {Convertor} converter Convertor instance
 **/
function Preview($el, eventManager, converter) {
    this.eventManager = eventManager;
    this.converter = converter;
    this.$el = $el;

    this._initContentSection();

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'refresh',
        this.refresh,
        800,
        this
    );

    this._initEvent();
}

/**
 * Initialize event
 * @private
 */
Preview.prototype._initEvent = function() {
    var self = this;
    var latestMarkdownValue;

    this.eventManager.listen('contentChangedFromMarkdown', function(markdownEditor) {
        latestMarkdownValue = markdownEditor.getValue();

        if (self.isVisible()) {
            self.lazyRunner.run('refresh', markdownEditor.getValue());
        }
    });

    this.eventManager.listen('previewNeedsRefresh', function(value) {
        self.refresh(value || latestMarkdownValue);
    });
};

/**
 * Initialize content selection
 * @private
 */
Preview.prototype._initContentSection = function() {
    this.$previewContent = $('<div class="tui-editor-contents" />');
    this.$el.append(this.$previewContent);
};

/**
 * Refresh rendering
 * @api
 * @memberOf Preview
 * @param {string} markdown Markdown text
 */
Preview.prototype.refresh = function(markdown) {
    this.render(this.converter.toHTMLWithCodeHightlight(markdown));
};

/**
 * Render HTML on preview
 * @api
 * @memberOf Preview
 * @param {string} html HTML string
 */
Preview.prototype.render = function(html) {
    var processedDataByHook,
        finalHtml = html;

    processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

    if (processedDataByHook) {
        finalHtml = processedDataByHook[0];
    }

    this.$previewContent.empty();
    this.$previewContent.html(finalHtml);

    this.eventManager.emit('previewRenderAfter', this);
};

/**
 * Set preview height
 * @api
 * @memberOf Preview
 * @param {number} height Height for preview container
 */
Preview.prototype.setHeight = function(height) {
    this.$el.height(height);
};

/**
 * Is Preview visible
 * @returns {boolean} result
 */
Preview.prototype.isVisible = function() {
    return this.$el.css('display') !== 'none';
};

module.exports = Preview;
