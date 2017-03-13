/**
 * @fileoverview Implements fake clipboard handler.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Team/NHN Ent.
 */

import htmlSanitizer from './htmlSanitizer';

const isMac = /Mac/.test(navigator.platform);
const META_KEY = isMac ? 'META' : 'CTRL';
let selectAllContent;

if (window.getSelection) {
    selectAllContent = clipboardBody => {
        window.getSelection().selectAllChildren(clipboardBody);
    };
} else {
    selectAllContent = clipboardBody => {
        const range = document.selection.createRange();
        range.moveToElementText(clipboardBody);
        range.selectAllContent();
    };
}


/**
 * WwPseudoClipboardHandler
 * @exports WwPseudoClipboardHandler
 * @constructor
 * @class WwPseudoClipboardHandler
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @param {object} eventHandler - EventHandler instance
 */
class WwPseudoClipboardHandler {
    constructor(wwe, eventHandler) {
        const $clipboardBody = $('<div class="tui-editor-pseudo-clipboard" contentEditable="true" />');

        this.wwe = wwe;
        this.eventManager = wwe.eventManager;
        this.wwEditor = wwe.getEditor();
        this.$editorBody = this.wwEditor.get$Body();
        this.$clipboardBody = $clipboardBody;

        this.wwe.$editorContainerEl.append($clipboardBody);
        this._initEvent(eventHandler);
    }

    /**
     * Initilize event for fake clipboard.
     * @param {function} onCopyBefore  - copy before handler
     * @param {function} onCopy - copy handler
     * @param {function} onCutBefore - cut before handler
     * @param {function} onCut - cut handler
     * @param {function} onPaste - paste handler
     * @private
     * @memberOf WwPseudoClipboardHandler
     */
    _initEvent({onCopyBefore, onCutBefore, onCut, onPaste}) {
        this.wwe.addKeyEventHandler(`${META_KEY}+C`, ev => {
            const selectedCellCount = this.wwe.componentManager.getManager('tableSelection').getSelectedCells().length;
            const cachedRange = this.wwEditor.getSelection().cloneRange();

            onCopyBefore(ev);

            setTimeout(() => {
                this.wwEditor.get$Body().focus();

                if (!selectedCellCount) {
                    this.wwEditor.setSelection(cachedRange);
                }
            }, 0);
        });

        this.wwe.addKeyEventHandler(`${META_KEY}+X`, onCutBefore);

        this.$clipboardBody.on('cut', $ev => {
            onCut($ev.originalEvent);

            setTimeout(() => {
                const range = this.wwEditor.getSelection();

                this.wwEditor.focus();
                range.deleteContents();
            }, 0);
        });

        this.wwe.addKeyEventHandler(`${META_KEY}+V`, () => {
            this.$clipboardBody.html('');
            this.$clipboardBody.focus();
        });

        this.$clipboardBody.on('paste', $ev => {
            this.eventManager.emit('paste', {
                source: 'wysiwyg',
                data: $ev.originalEvent
            });
        });

        this.eventManager.listen('paste', ev => {
            if (ev.source !== 'wysiwyg' || ev.data.defaultPrevented) {
                return;
            }
            setTimeout(() => {
                let html = this.$clipboardBody.html();
                this.$clipboardBody.html('');
                html = htmlSanitizer(html, true).trim();
                if (html) {
                    const $clipboardContainer = $('<div />');
                    $clipboardContainer.html(html);
                    onPaste($clipboardContainer);
                }

                this.wwEditor.focus();
            }, 0);
        });
    }

    /**
     * Set clipboard data.
     * @param {Event} ev - clipboard event like copy, cut
     * @param {string} htmlContent - html content
     * @memberOf WwPseudoClipboardHandler
     */
    setClipboardData(ev, htmlContent) {
        this.$clipboardBody.html(htmlContent);
        this.$clipboardBody.focus();

        selectAllContent(this.$clipboardBody[0]);
    }

    destroy() {
        if (this.$clipboardBody) {
            this.$clipboardBody.remove();
            this.$clipboardBody = null;
        }
    }
}

export default WwPseudoClipboardHandler;
