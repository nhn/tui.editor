/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import LazyRunner from './lazyRunner';

/**
 * Preview
 * @class Preview
 **/
class Preview {
    /**
     * Creates an instance of Preview.
     * @param {jQuery} $el Container element for preview
     * @param {EventManager} eventManager Event manager instance
     * @param {Convertor} convertor Convertor instance
     * @param {boolean} isViewOnly - whether viewOnly mode or not
     * @memberof Preview
     */
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
    }

    /**
     * Initialize content selection
     * @private
     */
    _initContentSection() {
        this._$previewContent = $('<div class="tui-editor-contents" />');
        this.$el.append(this._$previewContent);
    }

    /**
     * Refresh rendering
     * @memberof Preview
     * @param {string} markdown Markdown text
     */
    refresh(markdown) {
        this.render(this.convertor.toHTMLWithCodeHightlight(markdown));
    }

    /**
     * get html string
     * @returns {string} - html preview string
     * @memberof Preview
     */
    getHTML() {
        return this._$previewContent.html();
    }

    /**
     * set html string
     * @param {string} html - html preview string
     * @memberof Preview
     */
    setHTML(html) {
        this._$previewContent.html(html);
    }

    /**
     * Render HTML on preview
     * @memberof Preview
     * @param {string} html HTML string
     * @protected
     */
    render(html) {
        const {_$previewContent} = this;
        html = this.eventManager.emit('previewBeforeHook', html) || html;

        _$previewContent.empty();
        _$previewContent.html(html);
    }

    /**
     * Set preview height
     * @memberof Preview
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
