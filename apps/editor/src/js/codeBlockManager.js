/**
 * @fileoverview Implements CodeBlockManager
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Lab/NHN Ent.
 */

const util = tui.util;
const hljs = window.hljs;

const CUSTOM_CODE_BLOCK_CLASS_NAME = 'tui-editor-custom-code-block';

let sharedInstance;

/**
 * CodeBlockManager
 * @exports CodeBlockManager
 * @class
 */
class CodeBlockManager {
    constructor() {
        this._elementReplacer = new util.Map();
    }

    /**
     * Set replacer for code block element.
     * @param {string} type - code block type
     * @param {{viewOnly: ?function, wysiwyg: ?function, preview: ?function}} replacer - replacer to code block element
     */
    setElementReplacer(type, replacer) {
        this._elementReplacer.set(type, replacer);
    }

    /**
     * Create code block html.
     * @param {string} type - code block type or language type
     * @param {string} codeText - code text
     * @returns {string}
     */
    createCodeBlockHtml(type, codeText) {
        const replacer = this._elementReplacer.get(type);
        const className = CUSTOM_CODE_BLOCK_CLASS_NAME;
        let html;

        if (replacer) {
            codeText = encodeURIComponent(codeText).replace(/(%0A)+$/, '');
            html = `<pre class="${className}" data-language="${type}" data-code-text="${codeText}">${type}</pre>`;
        } else {
            html = hljs.getLanguage(type) ? hljs.highlight(type, codeText).value : escape(codeText, false);
        }

        return html;
    }

    /**
     * Get view mode for replace.
     * @param {boolean} isViewOnly - whether view only or not
     * @param {boolean} isWysiwygMode - whether wysiwyg mode or not
     * @returns {string}
     * @private
     */
    _getViewMode(isViewOnly, isWysiwygMode) {
        let replaceMode;

        if (isViewOnly) {
            replaceMode = 'viewOnly';
        } else if (isWysiwygMode) {
            replaceMode = 'wysiwyg';
        } else {
            replaceMode = 'preview';
        }

        return replaceMode;
    }

    /**
     * Replace the code block element.
     * @param {HTMLElement} containerElement - container element by view mode like viewOnly, wysiwyg, preview.
     * @param {HTMLElement} codeBlockElement - target code block element
     * @param {function} replace - function for replacing block element
     * @param {string} id - code block id
     * @private
     */
    _replaceElement(containerElement, codeBlockElement, replace, id) {
        const $codeBlock = $(codeBlockElement);
        const type = $codeBlock.data('language');
        const beforeParentNode = codeBlockElement.parentNode;
        const codeText = $codeBlock.data('code-text');
        const $newCodeBlock = $(replace({
            id,
            containerElement,
            codeBlockElement,
            type,
            codeText: decodeURIComponent(codeText)
        }));

        if ($newCodeBlock.length) {
            if (codeBlockElement !== $newCodeBlock[0] && beforeParentNode === codeBlockElement.parentNode) {
                $codeBlock.replaceWith($newCodeBlock);
            }

            $newCodeBlock[0].id = id;
            $newCodeBlock.data('language', type);
            $newCodeBlock.addClass(CUSTOM_CODE_BLOCK_CLASS_NAME);

            if (tui.util.isEmpty($newCodeBlock.data('code-text'))) {
                $newCodeBlock.data('code-text', codeText);
            }
        } else {
            codeBlockElement.id = id;
        }
    }

    /**
     * Replace code block elements.
     * @param {jQuery} $container - jQuery element container by view mode like viewOnly, wysiwyg, preview
     * @param {boolean} isViewOnly - whether view only or not
     * @param {boolean} isWysiwygMode - whether wysiwyg mode or not
     */
    replaceElements($container, isViewOnly, isWysiwygMode) {
        const $codeBlocks = $container.find(`.${CUSTOM_CODE_BLOCK_CLASS_NAME}`);
        const containerElement = $container[0];
        const viewMode = this._getViewMode(isViewOnly, isWysiwygMode);
        const replaceElement = $.proxy(this._replaceElement, this);
        const timestamp = (new Date()).getTime();

        $codeBlocks.each((index, codeBlockElement) => {
            const id = `${CUSTOM_CODE_BLOCK_CLASS_NAME}-${timestamp}-${index}`;
            const replacer = this._elementReplacer.get($(codeBlockElement).data('language'));
            const replace = replacer ? replacer[viewMode] : null;

            if (replace) {
                replaceElement(containerElement, codeBlockElement, replace, id);
            } else {
                codeBlockElement.id = id;
            }
        });
    }

    /**
     * Restore code block element to markdown-it style.
     * @param {HTMLElement} codeBlockElement - replaced code block element
     * @private
     */
    _restoreElement(codeBlockElement) {
        const $codeBlock = $(codeBlockElement);
        const type = $codeBlock.data('language');
        const codeText = decodeURIComponent($codeBlock.data('code-text'));
        const $pre = $(`<pre data-language="${type}" class="lang-${type}"></pre>`);

        if (codeText) {
            $pre.html(`<div>${escape(codeText, false).replace(/\n/g, '<br>')}</div>`);
        }

        $codeBlock.replaceWith($pre);
    }

    /**
     * Restore code block elements to markdown-it style.
     * @param {jQuery} $wweContainer - jQuery element container for wysiwyg editor
     * @private
     */
    restoreElements($wweContainer) {
        const $codeBlocks = $wweContainer.find(`.${CUSTOM_CODE_BLOCK_CLASS_NAME}`);
        const restoreElement = $.proxy(this._restoreElement, this);

        $codeBlocks.each((index, codeBlockElement) => {
            restoreElement(codeBlockElement);
        });
    }

    /**
     * Update code text by code block id and container element.
     * @param {HTMLElement} containerElement - container element by view mode like viewOnly, wysiwyg, preview.
     * @param {string} id - code block id
     * @param {string} codeText - code text for updating
     */
    updateCodeTextById(containerElement, id, codeText) {
        const $codeBlock = $(containerElement).find(`#${id}`);

        $codeBlock.data('code-text', encodeURIComponent(codeText));
    }

    /**
     * Get shared instance to CodeBlockManager.
     * @returns {CodeBlockManager}
     */
    static getSharedInstance() {
        if (!sharedInstance) {
            sharedInstance = new CodeBlockManager();
        }

        return sharedInstance;
    }
}


/**
 * escape code from markdown-it
 * @param {string} html HTML string
 * @param {string} encode Boolean value of whether encode or not
 * @returns {string}
 * @ignore
 */
function escape(html, encode) {
    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export {CodeBlockManager};
export default CodeBlockManager.getSharedInstance();
