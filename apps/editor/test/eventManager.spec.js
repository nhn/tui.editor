'use strict';

var EventManager = require('../src/js/eventManager');

describe('eventManager', function() {
    var ev;

    beforeEach(function() {
        ev = new EventManager();
    });

    describe('사용하는 이벤트를 등록 관리', function() {
        it('등록되지 않은 이벤트를 사용하는 경우 에러', function() {
            expect(function() {
                ev.listen('testNoEvent', function() {});
            }).toThrow(new Error('There is no event type testNoEvent'));
        });

        it('등록된 이벤트명으로 다시 이벤트를 등록하는 경우 에러', function() {
            ev.addEventType('testAlreadyHaveEvent');

            expect(function() {
                ev.addEventType('testAlreadyHaveEvent');
            }).toThrow(new Error('There is already have event type testAlreadyHaveEvent'));
        });
    });

    describe('이벤트 처리', function() {
        beforeEach(function() {
            ev.addEventType('testEvent');
            ev.addEventType('testEventHook');
        });

        it('listen으로 이벤트핸들러를 등록하고 emit으로 실행할수 있다', function() {
            var handler = jasmine.createSpy('handler');

            ev.listen('testEvent', handler);
            ev.emit('testEvent');

            expect(handler).toHaveBeenCalled();
        });

        it('핸들러가 특정값들을 리턴하면 emit시 배열로 리턴된다', function() {
            var result,
            count = 0;

            ev.listen('testEventHook', function() {
                return count;
            });

            ev.listen('testEventHook', function() {
                count += 1;
                return count;
            });

            result = ev.emit('testEventHook');

            expect(result).toEqual([0, 1]);
        });

        it('핸들러가 특정값을 리턴하지 않으면 emit은 undefined 리턴', function() {
            var handler = jasmine.createSpy('handler'),
            result;

            ev.listen('testEvent', handler);
            result = ev.emit('testEvent');

            expect(result).toBeUndefined();
        });
    });
    describe('emitReduce()', function() {
        beforeEach(function() {
            ev.addEventType('reduceTest');
        });

        it('emit handlers reduce style return value', function() {
            ev.listen('reduceTest', function(data) {
                data += 1;
                return data;
            });

            ev.listen('reduceTest', function(data) {
                data += 2;
                return data;
            });

            expect(ev.emitReduce('reduceTest', 1)).toEqual(4);
        });

        it('emitReduce can have additional parameter', function() {
            ev.listen('reduceTest', function(data, addition) {
                data += addition;
                return data;
            });

            ev.listen('reduceTest', function(data, addition) {
                data += (addition + 1);
                return data;
            });
            expect(ev.emitReduce('reduceTest', 1, 2)).toEqual(6);
        });

        it('emitReduce pass handler return value if return value is falsy', function() {
            ev.listen('reduceTest', function() {
                return;
            });

            ev.listen('reduceTest', function(data, addition) {
                data += (addition + 1);
                return data;
            });
            expect(ev.emitReduce('reduceTest', 1, 2)).toEqual(4);
        });
    });
});
