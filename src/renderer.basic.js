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
    'EM': function(runner) {
        var res;

        runner.next(); //it resolve text node

        res = '*' + this.convert(runner) + '*';

        return res;
    },
    'A': function(runner) {
        var res,
            url = runner.getNode().href;

        runner.next();

        res = '[' + this.convert(runner) + '](' + url + ')';

        return res;
    },
    'IMG': function(runner) {
        var res,
            src = runner.getNode().src,
            alt = runner.getNode().alt;

        runner.next();

        res = '![' + alt + '](' + src + ')';

        return res;
    },
    'H1, H2, H3, H4, H5, H6': function(runner) {
        var res = '',
            node = runner.getNode(),
            headingNumber = parseInt(node.tagName[1], 10);

        while (headingNumber) {
            res += '#';
            headingNumber -= 1;
        }

        res += ' ';
        res += this.convertChildNodes(runner);

        return res;
    },
    'UL': function(runner) {
        var res = '',
            node;

        node = runner.next();

        while (node && node.tagName && node.tagName === 'LI') {
            res += '* ' + this.convert(runner) + '\n';
            node = runner.next();
        }

        return res;
    },
    'OL': function(runner) {
        var res = '',
            node,
            number = 1;

        node = runner.next();

        while (node && node.tagName && node.tagName === 'LI') {
            res += number + '. ' + this.convert(runner) + '\n';
            number += 1;
            node = runner.next();
        }

        return res;
    },
    'LI': function(runner) {
        return this.convertChildNodes(runner);
    }
});

module.exports = basicRenderer;
