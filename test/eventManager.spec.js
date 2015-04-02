var EventManager = require('../src/js/eventManager');

describe('eventManager', function() {
    'use strict';

    var ev;

    beforeEach(function() {
        ev = new EventManager();
    });

    it('listen으로 이벤트핸들러를 등록하고 emit으로 실행할수 있다', function() {
        var handler = jasmine.createSpy('handler');

        ev.listen('event1', handler);
        ev.emit('event1');

        expect(handler).toHaveBeenCalled();
    });

    it('핸들러가 특정값들을 리턴하면 emit시 배열로 리턴된다', function() {
        var result,
        count = 0;

        ev.listen('EventHook', function() {
            return count;
        });

        ev.listen('EventHook', function() {
            count += 1;
            return count;
        });

        result = ev.emit('EventHook');

        expect(result).toEqual([0, 1]);
    });

    it('핸들러가 특정값을 리턴하지 않으면 emit은 undefined 리턴', function() {
        var handler = jasmine.createSpy('handler'),
        result;

        ev.listen('event1', handler);
        result = ev.emit('event1');

        expect(result).toBeUndefined();
    });
});
