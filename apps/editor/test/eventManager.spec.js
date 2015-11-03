'use strict';

var EventManager = require('../src/js/eventManager');

describe('eventManager', function() {
    var em;

    beforeEach(function() {
        em = new EventManager();
    });

    describe('사용하는 이벤트를 등록 관리', function() {
        it('등록되지 않은 이벤트를 사용하는 경우 에러', function() {
            expect(function() {
                em.listen('testNoEvent', function() {});
            }).toThrow(new Error('There is no event type testNoEvent'));
        });

        it('등록된 이벤트명으로 다시 이벤트를 등록하는 경우 에러', function() {
            em.addEventType('testAlreadyHaveEvent');

            expect(function() {
                em.addEventType('testAlreadyHaveEvent');
            }).toThrow(new Error('There is already have event type testAlreadyHaveEvent'));
        });
    });

    describe('이벤트 처리', function() {
        beforeEach(function() {
            em.addEventType('testEvent');
            em.addEventType('testEventHook');
        });

        it('listen으로 이벤트핸들러를 등록하고 emit으로 실행할수 있다', function() {
            var handler = jasmine.createSpy('handler');

            em.listen('testEvent', handler);
            em.emit('testEvent');

            expect(handler).toHaveBeenCalled();
        });

        it('핸들러가 특정값들을 리턴하면 emit시 배열로 리턴된다', function() {
            var result,
            count = 0;

            em.listen('testEventHook', function() {
                return count;
            });

            em.listen('testEventHook', function() {
                count += 1;
                return count;
            });

            result = em.emit('testEventHook');

            expect(result).toEqual([0, 1]);
        });

        it('핸들러가 특정값을 리턴하지 않으면 emit은 undefined 리턴', function() {
            var handler = jasmine.createSpy('handler'),
            result;

            em.listen('testEvent', handler);
            result = em.emit('testEvent');

            expect(result).toBeUndefined();
        });

        it('emit event handler added with namespace', function() {
            var handler = jasmine.createSpy('handler');

            em.listen('testEvent.ns', handler);
            em.emit('testEvent');
            expect(handler).toHaveBeenCalled();
        });
    });
    describe('emitReduce()', function() {
        beforeEach(function() {
            em.addEventType('reduceTest');
        });

        it('emit handlers reduce style return value', function() {
            em.listen('reduceTest', function(data) {
                data += 1;
                return data;
            });

            em.listen('reduceTest', function(data) {
                data += 2;
                return data;
            });

            expect(em.emitReduce('reduceTest', 1)).toEqual(4);
        });

        it('emitReduce can have additional parameter', function() {
            em.listen('reduceTest', function(data, addition) {
                data += addition;
                return data;
            });

            em.listen('reduceTest', function(data, addition) {
                data += (addition + 1);
                return data;
            });
            expect(em.emitReduce('reduceTest', 1, 2)).toEqual(6);
        });

        it('emitReduce pass handler return value if return value is falsy', function() {
            em.listen('reduceTest', function() {
                return;
            });

            em.listen('reduceTest', function(data, addition) {
                data += (addition + 1);
                return data;
            });
            expect(em.emitReduce('reduceTest', 1, 2)).toEqual(4);
        });
    });

    describe('remove handler', function() {
        var handlerBeRemoved, handlerBeRemained;
        beforeEach(function() {
            handlerBeRemoved = jasmine.createSpy('handlerBeRemoved');
            handlerBeRemained = jasmine.createSpy('handlerBeRemained');
            em.addEventType('myEvent');
            em.addEventType('myEvent2');
        });

        it('remove all event handler by event', function() {
            em.listen('myEvent', handlerBeRemoved);
            em.listen('myEvent.ns', handlerBeRemoved);

            em.removeEventHandler('myEvent');

            em.emit('myEvent');

            expect(handlerBeRemoved).not.toHaveBeenCalled();
        });

        it('remove all event handler by namespace', function() {
            em.listen('myEvent.ns', handlerBeRemoved);
            em.listen('myEvent2.ns', handlerBeRemoved);
            em.listen('myEvent', handlerBeRemained);

            em.removeEventHandler('.ns');

            em.emit('myEvent');
            em.emit('myEvent2');

            expect(handlerBeRemoved).not.toHaveBeenCalled();
            expect(handlerBeRemained).toHaveBeenCalled();
        });

        it('remove specific event handler by namespace and type', function() {
            em.listen('myEvent.ns', handlerBeRemoved);
            em.listen('myEvent2.ns', handlerBeRemained);
            em.listen('myEvent', handlerBeRemained);

            em.removeEventHandler('myEvent.ns');

            em.emit('myEvent');
            em.emit('myEvent2');

            expect(handlerBeRemoved).not.toHaveBeenCalled();
            expect(handlerBeRemained).toHaveBeenCalled();
        });
    });
});
