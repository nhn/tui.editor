/**
 * @fileoverview Implements clipboard handler.
 * @author Jiung Kang(jiung.kang@nhnent.com) FE Development Team/NHN Ent.
 */

/**
 * WwClipboardHandler
 * @exports WwClipboardHandler
 * @constructor
 * @class WwClipboardHandler
 * @param {WysiwygEditor} wwe - WysiwygEditor instance
 * @param {object} eventHandler - EventHandler instance
 */
class WwClipboardHandler {
    constructor(wwe, eventHandler) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;
        this.$editorBody = wwe.getEditor().get$Body();

        this._initEvent(eventHandler);
    }

    /**
     * Initilize event for clipboard.
     * @param {function} onCopyBefore  - copy before handler
     * @param {function} onCopy - copy handler
     * @param {function} onCutBefore - cut before handler
     * @param {function} onCut - cut handler
     * @param {function} onPaste - paste handler
     * @private
     * @memberOf WwClipboardHandler
     */
    _initEvent({onCopyBefore, onCutBefore, onCut, onPaste}) {
        this.$editorBody.on('copy', $ev => {
            const ev = $ev.originalEvent;

            onCopyBefore(ev);
        });

        this.$editorBody.on('cut', $ev => {
            const ev = $ev.originalEvent;

            onCutBefore(ev);
            onCut(ev);
        });

        this.$editorBody.on('paste', $ev => {
            onPaste($ev.originalEvent);
        });
    }

    /**
     * Set clipboard data.
     * @param {Event} ev - clipboard event like copy, cut
     * @param {string} htmlContent - html content
     * @param {string} textContent - text content
     * @memberOf WwClipboardHandler
     */
    setClipboardData(ev, htmlContent, textContent) {
        ev.clipboardData.setData('text/html', htmlContent);
        ev.clipboardData.setData('text/plain', textContent);
        ev.preventDefault();
        ev.stopPropagation();
    }
}

export default WwClipboardHandler;
