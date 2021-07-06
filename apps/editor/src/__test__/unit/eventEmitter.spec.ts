import EventEmitter from '@/event/eventEmitter';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('eventEmitter', () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe('Event registration', () => {
    it('should throw exception when it use not registered event type', () => {
      const throwableListen = () => {
        emitter.listen('testNoEvent', () => {});
      };

      expect(throwableListen).toThrow(new Error('There is no event type testNoEvent'));
    });

    it('should throw exception when it register event type that already have', () => {
      emitter.addEventType('testAlreadyHaveEvent');

      const throwableListen = () => {
        emitter.addEventType('testAlreadyHaveEvent');
      };

      expect(throwableListen).toThrow(
        new Error('There is already have event type testAlreadyHaveEvent')
      );
    });
  });

  describe('emit()', () => {
    beforeEach(() => {
      emitter.addEventType('testEvent');
      emitter.addEventType('testEventHook');
    });

    it('should emit and listen event', () => {
      const spy = jest.fn();

      emitter.listen('testEvent', spy);
      emitter.emit('testEvent');

      expect(spy).toHaveBeenCalled();
    });

    it('should return value that returned by listener', () => {
      let count = 0;

      emitter.listen('testEventHook', () => count);
      emitter.listen('testEventHook', () => {
        count += 1;

        return count;
      });

      const result = emitter.emit('testEventHook');

      expect(result).toEqual([0, 1]);
    });

    it('should return the empty array if listener have not return value', () => {
      emitter.listen('testEvent', jest.fn());

      const result = emitter.emit('testEvent');

      expect(result).toEqual([]);
    });

    it('should trigger the event handler added with namespace', () => {
      const spy = jest.fn();

      emitter.listen('testEvent.ns', spy);
      emitter.emit('testEvent');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('emitReduce()', () => {
    beforeEach(() => {
      emitter.addEventType('reduceTest');
    });

    it('reduce the return value', () => {
      emitter.listen('reduceTest', (data) => {
        data += 1;

        return data;
      });

      emitter.listen('reduceTest', (data) => {
        data += 2;

        return data;
      });

      expect(emitter.emitReduce('reduceTest', 1)).toBe(4);
    });

    it('can have additional parameter', () => {
      emitter.listen('reduceTest', (data, addition) => {
        data += addition;

        return data;
      });

      emitter.listen('reduceTest', (data, addition) => {
        data += addition + 1;

        return data;
      });
      expect(emitter.emitReduce('reduceTest', 1, 2)).toBe(6);
    });

    it('skip the return value if the value is falsy', () => {
      emitter.listen('reduceTest', () => {});

      emitter.listen('reduceTest', (data, addition) => {
        data += addition + 1;

        return data;
      });

      expect(emitter.emitReduce('reduceTest', 1, 2)).toBe(4);
    });
  });

  describe('remove handler', () => {
    let handlerBeRemoved: jest.Mock, handlerBeRemained: jest.Mock;

    beforeEach(() => {
      handlerBeRemoved = jest.fn();
      handlerBeRemained = jest.fn();

      emitter.addEventType('myEvent');
      emitter.addEventType('myEvent2');
    });

    it('remove all event handler by event', () => {
      emitter.listen('myEvent', handlerBeRemoved);
      emitter.listen('myEvent.ns', handlerBeRemoved);

      emitter.removeEventHandler('myEvent');

      emitter.emit('myEvent');

      expect(handlerBeRemoved).not.toHaveBeenCalled();
    });

    it('remove all event handler by namespace', () => {
      emitter.listen('myEvent.ns', handlerBeRemoved);
      emitter.listen('myEvent2.ns', handlerBeRemoved);

      emitter.removeEventHandler('.ns');

      emitter.emit('myEvent');
      emitter.emit('myEvent2');

      expect(handlerBeRemoved).not.toHaveBeenCalled();
    });

    it('should remain the non-namespace handler when removing namespace', () => {
      emitter.listen('myEvent', handlerBeRemained);

      emitter.removeEventHandler('.ns');

      emitter.emit('myEvent');

      expect(handlerBeRemained).toHaveBeenCalled();
    });

    it('remove specific event handler using namespace and type', () => {
      emitter.listen('myEvent.ns', handlerBeRemoved);

      emitter.removeEventHandler('myEvent.ns');

      emitter.emit('myEvent');

      expect(handlerBeRemoved).not.toHaveBeenCalled();
    });

    it('should remain the non-related handler when removing specific namespace and type', () => {
      emitter.listen('myEvent2.ns', handlerBeRemained);

      emitter.removeEventHandler('myEvent.ns');

      emitter.emit('myEvent2');

      expect(handlerBeRemained).toHaveBeenCalled();
    });

    it('remove specific event handler using name and handler', () => {
      emitter.listen('myEvent', handlerBeRemoved);

      emitter.removeEventHandler('myEvent', handlerBeRemoved);

      emitter.emit('myEvent');

      expect(handlerBeRemoved).not.toHaveBeenCalled();
    });
  });

  describe('hold event', () => {
    let handler: jest.Mock;

    function triggerEvent(apiName: 'emit' | 'emitReduce') {
      if (apiName === 'emit') {
        emitter.emit('myEvent');
      } else {
        emitter.emitReduce('myEvent', 0);
      }
    }

    beforeEach(() => {
      handler = jest.fn();

      emitter.addEventType('myEvent');

      emitter.listen('myEvent', handler);
    });

    (['emit', 'emitReduce'] as const).forEach((apiName) => {
      it(`should not call the holding event with ${apiName} API`, () => {
        emitter.holdEventInvoke(() => triggerEvent(apiName));

        expect(handler).not.toHaveBeenCalled();
      });

      it(`should call the event after holding the event with ${apiName} API`, () => {
        emitter.holdEventInvoke(() => triggerEvent(apiName));

        triggerEvent(apiName);

        expect(handler).toHaveBeenCalledTimes(1);
      });
    });
  });
});
