var mix = require('../src/js/mixinto');

describe('mixinto', function() {
    'use strict';

    var item1, item2, item3;

    beforeEach(function() {
        item1 = {
            name: 'item1',
            something1: function() {}
        };

        item2 = {
            name: 'item2',
            something2: function() {}
        };

        item3 = {
            name: 'item3',
            something3: function() {}
        };
    });

    describe('mix', function() {
        it('mix object that passed with parameter', function() {
            var mixed = mix(item1, item2, item3).obj;

            expect(mixed.name).toBe(item3.name);
            expect(mixed.something1).toBe(item1.something1);
            expect(mixed.something2).toBe(item2.something2);
            expect(mixed.something3).toBe(item3.something3);
        });

        it('object is mixed by parameter right priority', function() {
            var mixed = mix(item1, item2, item3).obj;

            expect(mixed.name).not.toEqual(item1.name);
            expect(mixed.name).not.toEqual(item2.name);
        });

        it('object by return mix() has into()', function() {
            var mixed = mix(item1, item2, item3);
            expect(mixed.into).toBeDefined();
        });
    });

    describe('into', function() {
        it('mixed object mix with parameter', function() {
            var target = {};

            mix(item1, item2, item3).into(target);

            expect(target.name).toBe(item3.name);
            expect(target.something1).toBe(item1.something1);
            expect(target.something2).toBe(item2.something2);
            expect(target.something3).toBe(item3.something3);
        });

        it('dont mix property that target object already have same key', function() {
            var target = {
                something2: 'test'
            };

            mix(item1, item2, item3).into(target);

            expect(target.name).toBe(item3.name);
            expect(target.something1).toBe(item1.something1);
            expect(target.something2).not.toBe(item2.something2);
            expect(target.something3).toBe(item3.something3);
        });
    });
});
