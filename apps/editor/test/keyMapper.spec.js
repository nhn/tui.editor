'use strict';

var KeyMapper = require('../src/js/keyMapper');

describe('KeyMapper', function() {
    var km;

    describe('Convert KeyboardEvent to string', function() {
        beforeEach(function() {
            km = new KeyMapper();
        });

        it('convert letter', function() {
            var ke = {
                keyCode: 'A'.charCodeAt(0)
            };

            expect(km.convert(ke)).toEqual('A');
        });

        it('convert altKey combination', function() {
            var ke = {
                keyCode: 'B'.charCodeAt(0),
                altKey: true
            };
            expect(km.convert(ke)).toEqual('ALT+B');
        });

        it('convert ctrlKey combination', function() {
            var ke = {
                keyCode: '1'.charCodeAt(0),
                ctrlKey: true
            };
            expect(km.convert(ke)).toEqual('CTRL+1');
        });

        it('convert metaKey combination', function() {
            var ke = {
                keyCode: '1'.charCodeAt(0),
                metaKey: true
            };
            expect(km.convert(ke)).toEqual('META+1');
        });

        it('convert shiftKey combination', function() {
            var ke = {
                keyCode: '0'.charCodeAt(0),
                shiftKey: true
            };
            expect(km.convert(ke)).toEqual('SHIFT+0');
        });

        it('convert ctrl + alt combination', function() {
            var ke = {
                keyCode: 219,
                ctrlKey: true,
                altKey: true
            };
            expect(km.convert(ke)).toEqual('CTRL+ALT+[');
        });

        it('convert shift + ctrl + alt combination', function() {
            var ke = {
                keyCode: 59,
                ctrlKey: true,
                altKey: true,
                shiftKey: true
            };
            expect(km.convert(ke)).toEqual('SHIFT+CTRL+ALT+;');
        });

        it('convert shift + ctrl + alt + meta combination', function() {
            var ke = {
                keyCode: 59,
                ctrlKey: true,
                altKey: true,
                shiftKey: true,
                metaKey: true
            };
            expect(km.convert(ke)).toEqual('SHIFT+CTRL+META+ALT+;');
        });
    });

    describe('Change splitter by option', function() {
        beforeEach(function() {
            km = new KeyMapper({
                splitter: '_'
            });
        });
        it('change splitter to underscore', function() {
            var ke = {
                keyCode: 'B'.charCodeAt(0),
                altKey: true
            };
            expect(km.convert(ke)).toEqual('ALT_B');
        });
    });
});
