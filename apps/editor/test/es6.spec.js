'use strict';

describe('es6', function() {
    describe('basic', function() {
        it('let', function() {
            if(true) {
                let c = 1;
            }

            try {
                expect(c).not.toBeDefined();
            }
            catch (e) {
            }
        });
        it('const', function() {
            const a = 10;
            expect(a).toEqual(10);
        });
        it('default', function() {
            function defaultValueFunction(x = 1, y = 2, z = 3) {
                expect(x).toEqual(1);
                expect(y).toEqual(2);
                expect(z).toEqual(3);
            }

            defaultValueFunction();
        });
        it('spread array', function() {
            var src = [1, 2, 3];
            var result = [...src, 4];

            expect(result).toEqual([1, 2, 3, 4]);
        });
        it('rest', function() {
            function restParameter(a, b, ...args) {
                expect(args).toEqual([3, 4]);
            }

            restParameter(1, 2, 3, 4);
        });
        it('destructuring array', function(){
            var [a, b, c] = [1, 2, 3];

            expect(a).toEqual(1);
            expect(b).toEqual(2);
            expect(c).toEqual(3);
        });
        it('destructuring object', function() {
            let {name, age} = { name: 'test', age: 10};

            expect(name).toEqual('test');
            expect(age).toEqual(10);
        });
        it('destructoring object parameter', function() {
            function destObjParam({name, age = 10}){
                expect(name).toEqual('test');
                expect(age).toEqual(10);
            }

            destObjParam({ name: 'test' });
        });
        it('dynamic property name', function() {
            var key = 'name';

            let {[key]: x} = { name: 'test'};

            expect(x).toEqual('test');
        });
        it('arrow - this', function() {
            var constr = function() {
                this.name = 'test';
                return () => { return this };
            };

            var func = new constr();

            expect(func().name).toEqual('test');
        });
        it('object literal', function() {
            var x = 1, y = 2;

            var obj = {
                x, y,
                method() {
                    return this.x;
                }
            }

            expect(obj.method()).toEqual(x);
            expect(obj.y).toEqual(y);
        });
    });
    describe('class', function() {
        it('declaration', function() {
            class Test {
                constructor(name) {
                    this.name = name;
                }
                getName() {
                    return this.name;
                }
            }

            var test = new Test('test');

            expect(test.getName()).toEqual('test');
        });
        it('getter, stter', function() {
            class Test {
                constructor(name) {
                    this.name = name;
                }
                get name() {
                    return this._name;
                }
                set name(name) {
                    this._name = 'name is ' + name;
                }
            }
            var test = new Test('test');

            expect(test.name).toEqual('name is test');
        });
        //transform needed
        xit('generator', function() {
            class Test {
                constructor(name) {
                    this.name = name;
                }
                * nameCount() {
                    yield this.name[0];
                    yield this.name[1];
                    yield this.name[2];
                    yield this.name[3];
                }
            }
            var test = new Test('test');

            expect(test.name).toEqual('name is test');
        });
        it('static method', function() {
            class Test {
                constructor(name) {
                    this.name = name;
                }
                static hello() {
                    return 'test';
                }
            }
            expect(Test.hello()).toEqual('test');
        });
    });
});
