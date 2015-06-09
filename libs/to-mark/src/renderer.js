/**
 * @fileoverview Implements Renderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

function forEachOwnProperties(obj, iteratee, context) {
    var key;

    context = context || null;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (iteratee.call(context, obj[key], key, obj) === false) {
                break;
            }
        }
    }
}

/**
 * Renderer
 * @exports Renderer
 * @constructor
 * @param {object} rules rules to add
 * @class
 */
function Renderer(rules) {
    this.rules = {};

    if (rules) {
        this.addRules(rules);
    }
}

Renderer.prototype.addRule = function(selectorString, converter) {
    var selectors = selectorString.split(', '),
        selector = selectors.pop();

    while (selector) {
        this._setConverterWithSelector(selector, converter);
        selector = selectors.pop();
    }
};

Renderer.prototype.addRules = function(rules) {
    var self = this;

    forEachOwnProperties(rules, function(converter, selectorString) {
        self.addRule(selectorString, converter);
    });
};

Renderer.prototype.convert = function(node, subContent) {
    var result,
        converter = this._getConverter(node);

    if (converter) {
        result = converter.call(this, node, subContent);
    }

    return result || subContent;
};

Renderer.prototype._getConverter = function (node) {
    var rulePointer = this.rules,
        converter;

    while (node && rulePointer) {
        rulePointer = this._getNextRule(rulePointer, this._getRuleNameFromNode(node));
        node = this._getPrevNode(node);

        if (rulePointer && rulePointer.converter) {
            converter = rulePointer.converter;
        }
    }

    return converter;
};

Renderer.prototype._getNextRule = function(ruleObj, ruleName) {
    return ruleObj[ruleName];
};

Renderer.prototype._getRuleNameFromNode = function(node) {
    return node.tagName || 'TEXT_NODE';
};

Renderer.prototype._getPrevNode = function(node) {
    var parentNode = node.parentNode;

    if (parentNode && !parentNode.__htmlRootByToMark) {
        return parentNode;
    }
};

Renderer.prototype._setConverterWithSelector = function(selectors, converter) {
    var rulePointer = this.rules;

    this._eachSelector(selectors, function(ruleElem) {
        if (!rulePointer[ruleElem]) {
            rulePointer[ruleElem] = {};
        }

        rulePointer = rulePointer[ruleElem];
    });

    rulePointer.converter = converter;
};

Renderer.prototype._eachSelector = function(selectors, iteratee) {
    var selectorIndex;

    selectors = selectors.split(' ');
    selectorIndex = selectors.length - 1;

    while (selectorIndex >= 0) {
        iteratee(selectors[selectorIndex]);
        selectorIndex -= 1;
    }
};

Renderer.prototype.trim = function(text) {
    return text.replace(/^[\s\r\n\t]+|[\s\r\n\t]+$/g, '');
};

Renderer.prototype.processText = function(text) {
    text = text.replace(/[\(\)\*\{\}\[\]\_\`\+\-\.\!#]/g, function(matched){ // eslint-disable-line space-before-blocks
        return '\\' + matched;
    });

    return text;
};

Renderer.factory = function(rules) {
    return new Renderer(rules);
};

module.exports = Renderer;
