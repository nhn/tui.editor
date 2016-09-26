/**
 * @fileoverview Implements wysiwyg p manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */


/**
 * WwPManager
 * @exports WwPManager
 * @class WwPManager
 * @constructor
 * @param {WysiwygEditor} wwe wysiwygEditor instance
 */
class WwPManager {
    constructor(wwe) {
        this.wwe = wwe;
        this.eventManager = wwe.eventManager;

        /**
         * Name property
         * @api
         * @memberOf WwPManager
         * @type {string}
         */
        this.name = 'p';

        this._initEvent();
    }

    /**
     * _initEvent
     * Initialize event
     * @memberOf WwPManager
     * @private
     */
    _initEvent() {
        this.eventManager.listen('wysiwygSetValueBefore', html => {
            return this._splitPtagContentLines(html);
        });

        this.eventManager.listen('wysiwygSetValueAfter', () => {
            this._ensurePtagContentWrappedWithDiv();
            this._unwrapPtags();
        });
    }

    /**
     * Split multiple line content of p tags
     * @param {string} html html text
     * @returns {string} result
     */
    _splitPtagContentLines(html) {
        html = html.replace(/<p>([\s\S]*?)<\/p>/gi, (whole, content) => {
            const lines = content.split(/<br>/gi);
            const linesLenIndex = lines.length - 1;
            let splitedContent = '';

            splitedContent = lines.map((line, index) => {
                let result = '';

                if (index > 0 && index < linesLenIndex) {
                    line = line ? line : '<br>';
                }

                if (line) {
                    result = `<div>${line}</div>`;
                }

                return result;
            });

            //For paragraph, we add empty line
            splitedContent.push('<div><br></div>');

            return splitedContent.join('');
        });

        return html;
    }

    /**
     * _ensurePtagContentWrappedWithDiv
     * Wrap new line inside P tag to DIV, and additional empty line added within too
     * @memberOf WwPManager
     * @private
     */
    _ensurePtagContentWrappedWithDiv() {
        this.wwe.get$Body().find('p').each((index, node) => {
            if ($(node).find('div').length <= 0) {
                $(node).wrapInner('<div />');
            }

            if ($(node).next().is('p')) {
                $(node).append('<div><br></div>');
            }
        });
    }

    /**
     * _unwrapPtags
     * Unwrap P tag
     * @memberOf WwPManager
     * @private
     */
    _unwrapPtags() {
        this.wwe.get$Body().find('div').each((index, node) => {
            if ($(node).parent().is('p')) {
                $(node).unwrap();
            }
        });
    }
}

module.exports = WwPManager;
