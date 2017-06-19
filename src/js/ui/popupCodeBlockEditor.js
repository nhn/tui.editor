import LayerPopup from './layerpopup';
import ScrollSyncSplit from './scrollSyncSplit';
import CodeBlockEditor from '../codeBlockEditor';
import CodeBlockPreview from '../codeBlockPreview';

const {util} = tui;

const CLASS_PREFIX = 'popup-editor-';
const TEMPLATE_HEADER_BUTTONS = `
    <button class="${CLASS_PREFIX}cancel">cancel</button>
    <button class="${CLASS_PREFIX}save">save</button>
    <button class="${CLASS_PREFIX}toggle-preview">split</button>
    <button class="${CLASS_PREFIX}toggle-fit">max</button>
`;

/**
 * popup code block editor
 * @class PopupCodeBlockEditor
 * @extends {LayerPopup}
 */
class PopupCodeBlockEditor extends LayerPopup {
    /**
     * Creates an instance of PopupCodeBlockEditor.
     * @param {LayerPopupOption} options - layer popup option
     * @memberof PopupCodeBlockEditor
     */
    constructor(options) {
        options = util.extend({
            header: true,
            title: 'CodeBlock Editor',
            content: '',
            className: 'tui-popup-code-block-editor',
            headerButtons: TEMPLATE_HEADER_BUTTONS,
            modal: true
        }, options);

        super(options);

        this._codeBlockEditor = null;
        this._toggleFitButton = null;
        this._togglePreviewButton = null;
        this._scrollSyncSplit = null;
        this.eventManager = options.eventManager;
        this.convertor = options.convertor;

        this.render();
        this._initDOMEvent();
        this._initEditorEvent();
    }

    /**
     * render popup
     * @memberof PopupCodeBlockEditor
     * @override
     */
    render() {
        super.render();

        const el = this.$el.get(0);
        this._toggleFitButton = el.querySelector(`.${CLASS_PREFIX}toggle-fit`);
        this._togglePreviewButton = el.querySelector(`.${CLASS_PREFIX}toggle-preview`);
        this._updateFitWindowButton();

        this._codeMirrorWrapper = this._createCodeBlockEditor();
        this._previewWrapper = this._createPreview();
        this._scrollSyncSplit = new ScrollSyncSplit(this.$body.get(0), this._codeMirrorWrapper, this._previewWrapper);
    }

    _createCodeBlockEditor() {
        const codeMirrorWrapper = document.createElement('div');
        codeMirrorWrapper.classList.add(`${CLASS_PREFIX}editor-wrapper`);

        this._codeBlockEditor = new CodeBlockEditor(codeMirrorWrapper, this.eventManager);

        return codeMirrorWrapper;
    }

    _createPreview() {
        const previewWrapper = document.createElement('div');
        this._codeBlockPreview = new CodeBlockPreview(
            $(previewWrapper),
            this.eventManager,
            this.convertor,
            this._codeBlockEditor
        );

        return previewWrapper;
    }

    _updateFitWindowButton() {
        const buttonClassList = this._toggleFitButton.classList;
        if (this.isFitToWindow()) {
            buttonClassList.remove('active');
        } else {
            buttonClassList.add('active');
        }
    }

    _initDOMEvent() {
        this.on(`click .${CLASS_PREFIX}toggle-fit`, this._toggleFitToWindow.bind(this));
        this.on(`click .${CLASS_PREFIX}toggle-preview`, this._togglePreview.bind(this));
        this.on(`click .${CLASS_PREFIX}save`, this._save.bind(this));
        this.on(`click .${CLASS_PREFIX}cancel`, this.hide.bind(this));
        this.on(`click .${CLASS_PREFIX}editor-wrapper`, ev => {
            if (ev.target === this._codeMirrorWrapper) {
                this._focusEditor(true);
            }
        });
    }

    _initEditorEvent() {
        this.eventManager.listen('openPopupCodeBlockEditor', codeBlockElement => {
            this.eventManager.emit('closeAllPopup');
            this.show(codeBlockElement);

            return this;
        });
        this.eventManager.listen('closeAllPopup', this.hide.bind(this));
        this.eventManager.listen('closePopupCodeBlockEditor', this.hide.bind(this));
    }

    _focusEditor(cursorToEnd) {
        this._codeBlockEditor.focus();
        if (cursorToEnd) {
            this._codeBlockEditor.moveCursorToEnd();
        } else {
            this._codeBlockEditor.moveCursorToStart();
        }
    }

    _togglePreview() {
        this._scrollSyncSplit.toggleSplitView();
        this._codeBlockEditor.refresh();
    }

    _toggleFitToWindow() {
        this.toggleFitToWindow();
        this._updateFitWindowButton();
        this._codeBlockEditor.refresh();
    }

    /**
     * store code mirror text to wysiwyg code block
     * @memberof PopupCodeBlockLanguages
     * @private
     */
    _save() {
        this._codeBlockEditor.save(this._codeBlockElement);
        this.hide();
    }

    /**
     * load code mirror text from wysiwyg code block
     * @param {HTMLElement} codeBlockElement - code block element instance to load code from
     * @private
     * @memberof PopupCodeBlockLanguages
     */
    _load(codeBlockElement) {
        this._codeBlockElement = codeBlockElement;
        this._codeBlockEditor.load(codeBlockElement);
        this._focusEditor();
        this._codeBlockPreview.refresh();
    }

    _cancel() {
        this.hide();
    }

    /**
     * show popup
     * @param {HTMLElement} codeBlockElement - code block element
     * @memberof PopupCodeBlockEditor
     * @override
     */
    show(codeBlockElement) {
        super.show();

        if (!codeBlockElement) {
            throw new Error('should be called with codeBlockElement');
        }
        this._load(codeBlockElement);
    }

    /**
     * hide popup
     * @memberof PopupCodeBlockEditor
     * @override
     */
    hide() {
        this.setFitToWindow(false);

        if (this._codeBlockEditor) {
            this._codeBlockEditor.clear();
        }
        if (this._codeBlockPreview) {
            this._codeBlockPreview.clear();
        }
        this._codeBlockElement = null;

        super.hide();
    }
}

module.exports = PopupCodeBlockEditor;
