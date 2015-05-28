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
        this.rules[selector] = converter;
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
        convertor = this.rules[runner.getNode().tagName || 'TEXT_NODE'];

    if (convertor) {
        result = convertor.call(this, runner);
    }

    return result;
};

Renderer.factory = function(rules) {
    var renderer = new Renderer(rules);
    return renderer;
};

module.exports = Renderer;
