/**
 * @fileoverview Implements htmlSanitizer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

var ATTR_WHITE_LIST_RX = /^(src|href|title|data\-+|class|alt|align|style|type|checked)/g;

/**
 * htmlSanitizer
 * @api
 * @exports htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
 */
function htmlSanitizer(html, needHtmlText) {
    var $html = $('<div />');

    $html.append(html);

    removeUnnecessaryTags($html);
    leaveOnlyWhitelistAttribute($html);

    return finalizeHtml($html, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {jQuery} $html jQuery instance
 */
function removeUnnecessaryTags($html) {
    $html.find('script, iframe, textarea, form, button, select, .Apple-converted-space').remove();
}

/**
 * Leave only white list attributes
 * @private
 * @param {jQuery} $html jQuery instance
 */
function leaveOnlyWhitelistAttribute($html) {
    $html.find('*').each(function(index, node) {
        var blacklist = util.toArray(node.attributes).filter(function(attr) {
            return !attr.name.match(ATTR_WHITE_LIST_RX);
        });

        util.forEachArray(blacklist, function(attr) {
            node.attributes.removeNamedItem(attr.name);
        });
    });
}

/**
 * Finalize html result
 * @private
 * @param {jQuery} $html jQuery instance
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 */
function finalizeHtml($html, needHtmlText) {
    var returnValue, frag;

    if (needHtmlText) {
        returnValue = $html[0].innerHTML;
    } else {
        frag = document.createDocumentFragment();
        $(frag).append($html[0].innerHTML);
        returnValue = frag;
    }

    return returnValue;
}

module.exports = htmlSanitizer;
