'use strict';

var LazyRunner = require('../src/js/lazyRunner');

describe('LazyRunner', function() {
    var lr;

    beforeEach(function() {
        lr = new LazyRunner();
        jasmine.clock().install();
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    describe('invoke function after delay time', function() {
        it('function has not invoke immediately', function() {
            var func = jasmine.createSpy('func');
            lr.run(func, 100);
            expect(func).not.toHaveBeenCalled();
        });

        it('function have been invoked after delay time', function() {
            var func = jasmine.createSpy('func');

            lr.run(func, 0);

            jasmine.clock().tick(1);

            expect(func).toHaveBeenCalled();
        });

        it('ignore current run function when run() is called again before current run function be invoked', function() {
            var func = jasmine.createSpy('func');

            lr.run(func, 0);
            lr.run(func, 0);

            jasmine.clock().tick(1);

            expect(func.calls.count()).toEqual(1);
        });

        it('althought run functions are different, ignore current run function when run() is called', function() {
            var func1 = jasmine.createSpy('func1'),
                func2 = jasmine.createSpy('func2');

            lr.run(func1, 0);
            lr.run(func1, 0);

            jasmine.clock().tick(1);

            expect(func1).toHaveBeenCalled();
            expect(func2).not.toHaveBeenCalled();
        });
    });

    describe('registered run', function() {
        it('It can be regist run with several params', function() {
            var func = jasmine.createSpy('func');

            lr.registerLazyRunFunction('lrrun', func, 0);

            lr.run('lrrun');

            jasmine.clock().tick(1);

            expect(func).toHaveBeenCalled();
        });

        it('ignore current run function that is not invoked yet when run() is called with same run again', function() {
            var func = jasmine.createSpy('func');

            lr.registerLazyRunFunction('lrrun', func, 0);

            lr.run('lrrun');
            lr.run('lrrun');

            jasmine.clock().tick(1);

            expect(func.calls.count()).toEqual(1);
        });

        it('if resgistered run functions are different, invoke without any ignoring', function() {
            var func1 = jasmine.createSpy('func1'),
            func2 = jasmine.createSpy('func2');

            lr.registerLazyRunFunction('run1', func1, 0, null);
            lr.registerLazyRunFunction('run2', func2, 0, null);

            lr.run('run1');
            lr.run('run2');

            jasmine.clock().tick(1);

            expect(func1).toHaveBeenCalled();
            expect(func2).toHaveBeenCalled();
        });

        it('if context are registred, fn is called with context', function() {
            var result,
                func,
                context;

            func = function() {
                result = this.res;
            };

            context = {
                res: 'myres'
            };

            lr.registerLazyRunFunction('lrrun', func, 0, context);

            lr.run('lrrun');

            jasmine.clock().tick(1);

            expect(result).toEqual('myres');
        });
    });
});

