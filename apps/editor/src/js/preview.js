/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


import LazyRunner from './lazyRunner';
import codeBlockManager from './codeBlockManager';

/**
 * Preview
 * @exports Preview
 * @class Preview
 * @constructor
 * @param {jQuery} $el Container element for preview
 * @param {EventManager} eventManager Event manager instance
 * @param {Convertor} convertor Convertor instance
 * @param {boolean} isViewOnly - whether viewOnly mode or not
 **/
class Preview {
    constructor($el, eventManager, convertor, isViewOnly) {
        this.eventManager = eventManager;
        this.convertor = convertor;
        this.$el = $el;
        this.isViewOnly = !!isViewOnly;

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
    _initEvent() {
        let latestMarkdownValue = '';

        this.eventManager.listen('contentChangedFromMarkdown', markdownEditor => {
            latestMarkdownValue = markdownEditor.getValue();

            if (this.isVisible()) {
                this.lazyRunner.run('refresh',
                    markdownEditor.getValue().replace(/<br>\n/g, '<br>'));
            }
        });

        this.eventManager.listen('previewNeedsRefresh', value => {
            this.refresh(value || latestMarkdownValue);
        });
        this.$el.on('scroll', event => {
            this.eventManager.emit('scroll', {
                source: 'preview',
                data: event
            });
        });
    }

    /**
     * Initialize content selection
     * @private
     */
    _initContentSection() {
        this.$previewContent = $('<div class="tui-editor-contents" />');
        this.$el.append(this.$previewContent);
    }

    /**
     * Refresh rendering
     * @api
     * @memberOf Preview
     * @param {string} markdown Markdown text
     */
    refresh(markdown) {
        this.render(this.convertor.toHTMLWithCodeHightlight(markdown));
    }

    /**
     * Render HTML on preview
     * @api
     * @memberOf Preview
     * @param {string} html HTML string
     */
    render(html) {
        let finalHtml = html;
        const processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

        if (processedDataByHook) {
            finalHtml = processedDataByHook[0];
        }

        this.$previewContent.empty();
        this.$previewContent.html(finalHtml);

        this.eventManager.emit('replaceCodeBlockElementsBefore');
        codeBlockManager.replaceElements(this.$previewContent, this.isViewOnly);

        this.eventManager.emit('previewRenderAfter', this);
    }

    /**
     * Set preview height
     * @api
     * @memberOf Preview
     * @param {number} height Height for preview container
     */
    setHeight(height) {
        this.$el.height(height);
    }

    /**
     * Is Preview visible
     * @returns {boolean} result
     */
    isVisible() {
        return this.$el.css('display') !== 'none';
    }
}

module.exports = Preview;
