'use strict';

var UIController = require('../src/js/uicontroller');

describe('UIController', function() {
    var uic;

    beforeEach(function() {
        uic = new UIController();
    });

    describe('on()', function() {
        it('커스텀 이벤트를 바인드할수있다.', function() {
            var spy = jasmine.createSpy();

            uic.on('event!', spy);

            uic.trigger('event!');

            expect(spy).toHaveBeenCalled();
        });

        it('jQuery 형식으로 el에  이벤트를 바인드할수있다.', function() {
            var spy = jasmine.createSpy();

            uic.on('click', spy);

            uic.$el.trigger('click');

            expect(spy).toHaveBeenCalled();
        });

        it('객체로 이벤트를 바인드할수있다.', function() {
            var spy = jasmine.createSpy();

            uic.on({
                'event!': spy
            });

            uic.trigger('event!');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('off()', function() {
        it('커스텀 이벤트를 취소한다..', function() {
            var spy = jasmine.createSpy();

            uic.on('event!', spy);

            uic.off('event!');

            uic.trigger('event!');

            expect(spy).not.toHaveBeenCalled();
        });

        it('jQuery 형식으로 el에  이벤트를 언바인드할수있다..', function() {
            var spy = jasmine.createSpy();

            uic.on('click', spy);
            uic.off('click');
            uic.$el.trigger('click');

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('attachEvents()', function() {
        var eventlist,
            handler;

        beforeEach(function() {
            eventlist = {
                'click .test': 'handler'
            };

            handler = jasmine.createSpy('handler');
        });

        it('인자로 이벤트 리스트를 넘겨 이벤트를 걸수있다', function() {
            uic.handler = handler;

            uic.$el.html('<span class="test">t</span>');

            uic.attachEvents(eventlist);

            uic.$el.find('.test').trigger('click');

            expect(handler).toHaveBeenCalled();
        });

        it('this.events객체를 이용해 이벤트를 걸수있다', function() {
            uic.events = eventlist;
            uic.handler = handler;

            uic.$el.html('<span class="test">t</span>');
            uic.attachEvents();

            uic.$el.find('.test').trigger('click');

            expect(handler).toHaveBeenCalled();
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

        it('events의 내응을 이벤트 해제한다.', function() {
            uic.detachEvents();
            uic.$el.find('.test').trigger('click');

            expect(testFlag).toEqual(false);
        });
    });

    describe('setRootElement()', function() {
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

    describe('template()', function() {
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
                obj = [{text: 'some'}, {text: 'some2'}],
                renderedText;

            renderedText = uic.template(tmpl, obj);

            expect(renderedText.length).toEqual(2);
            expect(renderedText[1]).toEqual('<div>some2</div>');
        });
    });


    describe('addUIC()', function() {
       it('uic를 dom상에 append한다', function() {
            var subUic = new UIController();

            uic.addUIC(subUic);

            expect(uic.$el.find('div').length).toEqual(1);
       });
    });
});
