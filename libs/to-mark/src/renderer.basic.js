/**
 * @fileoverview Implements basicRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Renderer = require('./renderer');

/**
 * basicRenderer
 * @exports basicRenderer
 * @augments Renderer
 */
var basicRenderer = Renderer.factory({
    'TEXT_NODE': function(runner) {
        return runner.getNode().nodeValue;
    },
    'H1, H2, H3, H4, H5, H6': function(runner) {
        var res;

        res = '# ';

        if (runner.getNode().childNodes.length) {
            runner.next();
            res += this.convert(runner);
        }


        return res;
    },
    'EM': function(runner) {
        return '*' + runner.getNode().innerText + '*';
    }
});


module.exports = basicRenderer;
