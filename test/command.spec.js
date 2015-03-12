var Command = require('../src/js/command');

describe('', function() {
    'use strict';

    describe('메서드를 등록해 실행할 수 있다.', function() {
        it('정상적으로 메서드가 등록되어 exec()로 실행된다', function() {
            var cmd = new Command(),
                result;

            cmd.addMethod(function() {
                result = true;
            });

            cmd.exec();

            expect(result).toBe(true);
        });
    });

    describe('메서드를 타입과 함께 등록해 실행할 수 있다', function() {
        it('정상적으로 메서드가 등록되어 exec()로 실행된다', function() {
            var cmd = new Command(),
                result;

            cmd.addMethod('mdEditor', function() {
                result = true;
            });

            cmd.exec('mdEditor');

            expect(result).toBe(true);
        });
    });

    describe('메서드를 실행한 반환값을 받을 수 있다.;', function() {
        it('반환값을 받는다', function() {
            var cmd = new Command();

            cmd.addMethod('mdEditor', function() {
                return true;
            });

            cmd.exec('mdEditor');

            expect(cmd.exec('mdEditor')).toBe(true);
        });
    });
});