var UIController = require('../../../src/js/ui/uicontroller'),
    InteractBroker = require('../../../src/js/interactBroker');

describe('UIController', function() {
    var uic, ib;

    beforeEach(function() {
        uic = new UIController();
        ib = new InteractBroker();
    });

    describe('setIB', function(){
        it('InteractBroker를 셋팅할수있다', function() {
            uic.setIB(ib);

            expect(uic.IB).toBe(ib);
        });

        it('IB가 셋팅이 되고 uic에 onSetIB 메소드가 구현되어있으면 실행한다', function() {
            uic.onSetIB = jasmine.createSpy('onsetib');
            uic.setIB(ib);

            expect(uic.onSetIB).toHaveBeenCalled();
        });
    });

    describe('listen()', function() {
        it('InteractBroker에서 메세지를 받을수있다.', function(){
            var param = null;

            uic.setIB(ib);
            uic.listen('justevent', function(data){
                param = data;
            });

            ib.emit('justevent', 5);

           expect(param).toEqual(5);
        });
    });

    describe('stopListen()', function() {
        var param;

        beforeEach(function(){
            param = null;

            uic.setIB(ib);
            uic.listen('justevent', function(data){
                param = data;
            });
        });

        it('IB에서 메세지구독을 해제한다', function() {
            uic.stopListen();
            ib.emit('justevent', 5);

            expect(param).toEqual(null);
        });
    });

    describe('emit()', function() {
        var param;

        beforeEach(function(){
            param = null;

            uic.setIB(ib);
            uic.listen('justevent', function(data){
                param = data;
            });
        });

        it('IB에 emit()메소드를 실행하며 인자를 전달한다. ', function() {
            uic.emit('justevent', 5);

            expect(param).toEqual(5);
        });
    });

    describe('on()', function() {
        it('커스텀 이벤트를 바인드할수있다.', function() {
            var check = false;

            uic.on('event!', function() {
                check = true;
            });

            uic.fireEvent('event!');

            expect(check).toEqual(true);
        });

        it('jQuery 형식으로 el에  이벤트를 바인드할수있다.', function() {
            var check = false;

            uic.on('click', function() {
                check = true;
            });

            uic.$el.trigger('click');

            expect(check).toEqual(true);
        });

        it('객체로 이벤트를 바인드할수있다.', function() {
            var check = false;

            uic.on({
                'event!': function() {
                    check = true;
                }
            });

            uic.fireEvent('event!');

            expect(check).toEqual(true);
        });
    });

    describe('_addEvent()', function(){
        it('커스텀 이벤트를 바인드할수있다.', function() {
            var check = false;

            uic._addEvent('event!', function() {
                check = true;
            });

            uic.fireEvent('event!');

            expect(check).toEqual(true);
        });

        it('jQuery 형식으로 el에  이벤트를 바인드할수있다.', function() {
            var check = false;

            uic._addEvent('click', function() {
                check = true;
            });

            uic.$el.trigger('click');

            expect(check).toEqual(true);
        });
    });

    describe('off()', function() {
        it('커스텀 이벤트를 취소한다..', function() {
            var check = false;

            uic.on('event!', function() {
                check = true;
            });

            uic.off('event!');

            uic.fireEvent('event!');

            expect(check).toEqual(false);
        });

        it('jQuery 형식으로 el에  이벤트를 언바인드할수있다..', function() {
            var check = false;

            uic.on('click', function() {
                check = true;
            });

            uic.off('click');
            uic.$el.trigger('click');

            expect(check).toEqual(false);
        });
    });

    describe('_parseEventType()', function() {
        it('이벤트 타입으로 아벤트종류와 셀렉터를 구분한다.', function() {
            var parsedType = uic._parseEventType('click .tab a');

            expect(parsedType[0]).toEqual('click');
            expect(parsedType[1]).toEqual('.tab a');
        });
    });

    describe('isDomEvent()', function() {
        it('이벤트와 셀렉터를 넘겨 돔이벤트를 구분할수있다.', function() {
            var result = uic.isDomEvent('click .tab a');
            expect(result).toEqual(true);
        });

        it('이벤트와 네임스페이스, 셀렉터를 넘겨 돔이벤트를 구분할수있다.', function() {
            var result = uic.isDomEvent('click.myname #tab a');
            expect(result).toEqual(true);
        });

        it('이벤트명을 넘겨 돔이벤트를 구분할수있다.', function() {
            var result = uic.isDomEvent('click');
            expect(result).toEqual(true);
        });

        it('돔이벤트가 아니면 false를 리턴한다.', function() {
            var result = uic.isDomEvent('clickable.myname #tab a');
            expect(result).toEqual(false);
        });
    });


    describe('attachEvents()', function() {
        it('this.events객체를 이용해 이벤트를 걸수있다', function(){
            var testFlag = false;

            uic.events = {
                'click .test': '_eventest'
            };

            uic._eventest = function() {
                testFlag = true;
            };

            uic.$el.html('<span class="test">t</span>');
            uic.attachEvents();

            uic.$el.find('.test').trigger('click');

            expect(testFlag).toEqual(true);
        });
    });

    describe('detachEvents()', function() {
        var testFlag = false;

        beforeEach(function() {
            uic.events = {
                'click .test': '_eventest'
            };

            uic._eventest = function() {
                testFlag = true;
            };

            uic.$el.html('<span class="test">t</span>');
            uic.attachEvents();
        });

        it('events의 내응을 이벤트 해제한다.', function(){
            uic.detachEvents();
            uic.$el.find('.test').trigger('click');

            expect(testFlag).toEqual(false);
        });
    });

    describe('setRootElement()', function(){
        it('jQuery 엘리먼트를 $el로 셋팅할수있다', function() {
            var elem = $('<div />');

            uic.setRootElement(elem);

            expect(uic.$el).toBe(elem);
        });

        it('인자를 전달하지 않으면 디폴트로 div 엘리먼트를 생성한다', function() {
            uic.setRootElement();
            expect(uic.$el[0].tagName).toBe('DIV');
        });

        it('각종 속성으로 원하는 루트 엘리먼트를 생성할수있다', function() {
            uic.tagName = 'ol';
            uic.className = 'myclass';
            uic.setRootElement();

            expect(uic.$el[0].tagName).toEqual('OL');
            expect(uic.$el[0].className).toEqual('myclass');
        });
    });

    describe('template()', function(){
        it('템플릿 텍스트와 매핑할 데이터 객체를 넘기면 맵핑된 텍스트가 리턴된다.', function() {
            var tmpl = '<div><%=text%></div>',
                obj = {
                    text: 'some'
                },
                renderedText;

            renderedText = uic.template(tmpl, obj);

            expect(renderedText.length).toEqual(1);
            expect(renderedText[0]).toEqual('<div>some</div>');
        });

        it('매핑데이터가 배열이면 배열의 갯수만큼 배열로 리턴된다', function() {
            var tmpl = '<div><%=text%></div>',
                obj = [{ text: 'some' }, { text: 'some2'}],
                renderedText;

            renderedText = uic.template(tmpl, obj);

            expect(renderedText.length).toEqual(2);
            expect(renderedText[1]).toEqual('<div>some2</div>');
        });
    });


    describe('addUIC()', function() {
       it('IB를 서로 연결하고 파라메터로 넘겨진 uic의 루트엘리먼트도 포함시킨다.', function() {
            var subUic = new UIController();

            uic.addUIC(subUic);

            expect(uic.IB).toBe(subUic.IB);
            expect(uic.$el.find('div').length).toEqual(1);
       });
    });

    describe('setInteractive()', function(){
        it('false를 파라메터로 넘기면 attachEvents로 이벤트가 추가되지 않는다', function() {
            var testFlag = false;

            uic.setInteractive(false);

            uic.events = {
                'click .test': '_eventest'
            };

            uic._eventest = function() {
                testFlag = true;
            };

            uic.$el.html('<span class="test">t</span>');
            uic.attachEvents();

            uic.$el.find('.test').trigger('click');

            expect(testFlag).toEqual(false);
        });

        it('이벤트가 이미 추가된상태에서 false파라메터를 넘기면 이벤트가 detach된다.', function() {
            var testFlag = false;

            uic.events = {
                'click .test': '_eventest'
            };

            uic._eventest = function() {
                testFlag = true;
            };

            uic.$el.html('<span class="test">t</span>');
            uic.attachEvents();

            uic.setInteractive(false);
            uic.$el.find('.test').trigger('click');

            expect(testFlag).toEqual(false);
        });
    });
});
