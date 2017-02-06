/**
 * @fileoverview Implements fake clipboard handler.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Team/NHN Ent.
 */

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
 * FakeDataTransfer
 * Fake DataTransfer for paste.
 * @constructor
 * @class FakeDataTransfer
 * @param {object} data - data for initionalizing
 */
class FakeDataTransfer {
    constructor(data) {
        this.html = data.html;
    }

    /**
     * get data.
     * @returns {string}
     * @memberOf FakeDataTransfer
     */
    getData() {
        return this.html;
    }
}

/**
 * WwFakeClipboardHandler
 * @exports WwFakeClipboardHandler
 * @constructor
 * @class WwFakeClipboardHandler
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @param {object} eventHandler - EventHandler instance
 */
class WwFakeClipboardHandler {
    constructor(wwe, eventHandler) {
        const $clipboardBody = $('<div class="tui-editor-fake-clipboard" contentEditable="true" />');

        this.wwe = wwe;
        this.eventManager = wwe.eventManager;
        this.wwEditor = wwe.getEditor();
        this.$editorBody = this.wwEditor.get$Body();
        this.$clipboardBody = $clipboardBody;

        $(document.body).append($clipboardBody);
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
     * @memberOf WwFakeClipboardHandler
     */
    _initEvent({onCopyBefore, onCutBefore, onCut, onPaste}) {
        this.wwe.addKeyEventHandler(`${META_KEY}+C`, ev => {
            const cachedRange = this.wwEditor.getSelection().cloneRange();

            onCopyBefore(ev);

            setTimeout(() => {
                this.wwEditor.focus();
                this.wwEditor.setSelection(cachedRange);
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

        this.$clipboardBody.on('paste', () => {
            setTimeout(() => {
                const html = this.$clipboardBody.html();

                this.$clipboardBody.html('');

                const ev = {
                    clipboardData: new FakeDataTransfer({html})
                };

                onPaste(ev);
                this.wwEditor.focus();
            }, 0);
        });
    }

    /**
     * Set clipboard data.
     * @param {Event} ev - clipboard event like copy, cut
     * @param {string} htmlContent - html content
     * @memberOf WwFakeClipboardHandler
     */
    setClipboardData(ev, htmlContent) {
        this.$clipboardBody.html(htmlContent);
        this.$clipboardBody.focus();

        selectAllContent(this.$clipboardBody[0]);
    }
}

export default WwFakeClipboardHandler;
