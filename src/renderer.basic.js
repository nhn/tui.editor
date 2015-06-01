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
        //todo text escape 처리 모듈 추가
        return runner.getNode().nodeValue;
    },
    'EM': function(runner) {
        runner.next(); //it resolve text node
        return '*' + this.convert(runner) + '*';
    },
    'H1, H2, H3, H4, H5, H6': function(runner) {
        var res = '',
            node = runner.getNode(),
            headingNumber = parseInt(node.tagName[1], 10),
            childNodeLength = node.childNodes.length;

        while (headingNumber) {
            res += '#';
            headingNumber -= 1;
        }

        res += ' ';

        while (childNodeLength) {
            runner.next();
            res += this.convert(runner);
            childNodeLength -= 1;
        }

        return res;
    },
    'UL LI': function() {

    }
});

module.exports = basicRenderer;
