'use strict';

var domUtils = require('../src/js/domUtils.js');

describe('domUtils', function() {
    afterEach(function() {
        $('body').empty();
    });

    describe('getChildNodeAt()', function() {
        it('returns childNodes at index', function() {
            var result;

            $('body').html([
                '<ul>',
                    '<li>0</li>',
                    '<li>1</li>',
                '</ul>'
            ].join(''));

            result = domUtils.getChildNodeAt($('ul')[0], 1);

            expect(result).toEqual($('li')[1]);
        });

        it('returns undefined if theres no result', function() {
            var result;

            $('body').html([
                '<ul>',
                    '<li>0</li>',
                    '<li>1</li>',
                '</ul>'
            ].join(''));

            result = domUtils.getChildNodeAt($('ul')[0], 2);

            expect(result).toBeUndefined();
        });

        it('returns undefined if there is no child', function() {
            var result;

            $('body').html('<ul></ul>');

            result = domUtils.getChildNodeAt($('ul')[0], 2);

            expect(result).toBeUndefined();
        });

        it('returns childNodes if index >= 0', function() {
            var result;

            $('body').html([
                '<ul>',
                    '<li>0</li>',
                    '<li>1</li>',
                '</ul>'
            ].join(''));

            result = domUtils.getChildNodeAt($('ul')[0], -1);

            expect(result).toBeUndefined();
        });
    });

    describe('getNodeName', function() {
        it('returns tagName if passed Node is ELEMENT_NODE', function() {
            expect(domUtils.getNodeName($('<div />')[0])).toEqual('DIV');
            expect(domUtils.getNodeName($('<BR />')[0])).toEqual('BR');
            expect(domUtils.getNodeName($('<H1 />')[0])).toEqual('H1');
        });

        it('returns "TEXT" if passed node is TEXT_NODE', function() {
            expect(domUtils.getNodeName($('<p>hi</p>')[0].firstChild)).toEqual('TEXT');
        });
    });

    describe('isTextNode', function() {
        it('return true if passed node is TEXT_NODE', function() {
            expect(domUtils.isTextNode($('<p>hi</p>')[0].firstChild)).toBe(true);
        });
        it('return false if passed node is not TEXT_NODE', function() {
            expect(domUtils.isTextNode($('<p>hi</p>')[0])).toBe(false);
        });
    });

    describe('isElemNode', function() {
        it('return true if passed node is ELEMENT_NODE', function() {
            expect(domUtils.isElemNode($('<p>hi</p>')[0])).toBe(true);
        });
        it('return false if passed node is not ELEMENT_NODE', function() {
            expect(domUtils.isElemNode($('<p>hi</p>')[0].firstChild)).toBe(false);
        });
    });

    describe('getOffsetLength', function() {
        it('returns node\'s text content length', function() {
            expect(domUtils.getTextLength($('<p>hi</p>')[0])).toBe(2);
            expect(domUtils.getTextLength($('<p>hi</p>')[0].firstChild)).toBe(2);
        });
    });

    describe('getOffsetLength', function() {
        it('return childNodes length if passed node is ELEMENT_NODE', function() {
            expect(domUtils.getOffsetLength($('<p>hi</p>')[0])).toBe(1);
        });
        it('return nodeValue length if passed node is TEXT_NODE', function() {
            expect(domUtils.getOffsetLength($('<p>hi</p>')[0].firstChild)).toBe(2);
        });
    });
});
