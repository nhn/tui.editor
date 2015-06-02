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
 * @augments
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
        //this.rules[selector] = converter;
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

Renderer.prototype.convert = function(runner) {
    var result,
        converter = this._getConverter(runner.getNode());

    if (converter) {
        result = converter.call(this, runner);
    }

    return result || '';
};

Renderer.prototype._getConverter = function (node) {
    var nodePointer = node.parentNode,
        rulePointer = this.rules[node.tagName || 'TEXT_NODE'],
        converter;

    if (rulePointer) {
        while (nodePointer && rulePointer[nodePointer.tagName]) {
            rulePointer = rulePointer[nodePointer.tagName];
            nodePointer = nodePointer.parentNode;
        }

        converter = rulePointer.converter;
    }

    return converter;
};

Renderer.prototype._setConverterWithSelector = function(selector, converter) {
    var selectorIndex,
        ruleElem,
        rulePointer = this.rules;

    selector = selector.split(' ');
    selectorIndex = selector.length - 1;

    while (selectorIndex >= 0) {
        ruleElem = selector[selectorIndex];

        if (!rulePointer[ruleElem]) {
            rulePointer[ruleElem] = {};
        }

        rulePointer = rulePointer[ruleElem];

        selectorIndex -= 1;
    }

    rulePointer.converter = converter;
};

Renderer.prototype.convertChildNodes = function(runner) {
    var childNodeLength,
        res = '';

    childNodeLength = runner.getNode().childNodes.length;

    while (childNodeLength) {
        runner.next();
        res += this.convert(runner);
        childNodeLength -= 1;
    }

    return res;
};

Renderer.factory = function(rules) {
    var renderer = new Renderer(rules);
    return renderer;
};

module.exports = Renderer;
