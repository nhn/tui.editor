
import Preview from './preview';

/**
 * Class Markdown Preview
 * @extends {Preview}
 */
class MarkdownPreview extends Preview {
    /**
     * Creates an instance of MarkdownPreview.
     * @param {jQuery} $el - base jQuery element
     * @param {EventManager} eventManager - event manager
     * @param {Convertor} convertor - convertor
     * @param {boolean} isViewOnly - true for view only mode
     * @memberof MarkdownPreview
     */
    constructor($el, eventManager, convertor, isViewOnly) {
        super($el, eventManager, convertor, isViewOnly);

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
                this.lazyRunner.run('refresh', latestMarkdownValue.replace(/<br>\n/g, '<br>'));
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
     * render
     * @param {string} html - html string to render
     * @memberof MarkdownPreview
     * @override
     */
    render(html) {
        super.render(html);

        this.eventManager.emit('previewRenderAfter', this);
    }
}

export default MarkdownPreview;
