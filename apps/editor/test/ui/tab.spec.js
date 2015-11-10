var Tab = require('../../src/js/ui/tab');

describe('Tab', function() {
    'use strict';

    var tab;

    beforeEach(function() {
        $('body').empty();
    });

    describe('매뉴명을 입력받아 버튼을 만든다', function() {
        it('items옵션으로 매뉴명을 입력받아 매뉴들이 생성된다', function() {
            var buttons;

            tab = new Tab({
                items: ['tab1', 'tab2']
            });

            $('body').append(tab.$el);

            buttons = $('button');

            expect($(buttons[0]).text()).toEqual('tab1');
            expect($(buttons[1]).text()).toEqual('tab2');
        });
    });

    describe('매뉴명을 기준으로 커스텀이벤트를 걸어 클릭시 이벤트를 받을 수 있다', function() {
        it('onItemClick 옵션으로 핸들러를 받아서 버튼의 클릭이벤트를 처리할수 있다', function() {
            var handler = jasmine.createSpy('onItemClick');

            tab = new Tab({
                items: ['tab1', 'tab2'],
                onItemClick: handler
            });

            $('body').append(tab.$el);

            $('button').eq(0).trigger('click');

            expect(handler).toHaveBeenCalled();
        });

        it('핸들러에 인자로 버튼의 네임 넘어간다', function() {
            var spy = jasmine.createSpy('onItemClick');

            tab = new Tab({
                items: ['tab1', 'tab2'],
                onItemClick: spy
            });

            $('body').append(tab.$el);

            $('button').eq(0).trigger('click');

            expect(spy.calls.mostRecent().args[1]).toEqual('tab1');
        });
    });

    describe('버튼이 클릭되면 해당버튼이 활성화 효과를 얻는다', function() {
        beforeEach(function() {
            var handler = jasmine.createSpy('onItemClick');

            tab = new Tab({
                items: ['tab1', 'tab2'],
                onItemClick: handler
            });

            $('body').append(tab.$el);
        });

        it('버튼에 active클래스가 추가된다', function() {
            var $clickedButton;

            $clickedButton = $('button').eq(1);

            $clickedButton.trigger('click');

            expect($clickedButton.hasClass('active')).toBe(true);
        });

        it('기존버튼은 active클래스가 사라지고 새로 클릭된 버튼에 active가 존재한다', function() {
            var $clickedButton1,
                $clickedButton2;

            $clickedButton1 = $('button').eq(0);
            $clickedButton2 = $('button').eq(1);

            $clickedButton1.trigger('click');
            $clickedButton2.trigger('click');

            expect($clickedButton1.hasClass('active')).not.toBe(true);
            expect($clickedButton2.hasClass('active')).toBe(true);
        });
    });

    describe('initName옵션으로 탭명을 입력하면 시작시 그 탭이 활성화되어 시작된다', function() {
        var tabSection1,
            tabSection2;

        beforeEach(function() {
            tabSection1 = $('<div>tab1</div>');
            tabSection2 = $('<div>tab2</div>');

            $('body').append(tabSection1);
            $('body').append(tabSection2);

            tab = new Tab({
                initName: 'tab2',
                items: ['tab1', 'tab2'],
                sections: [tabSection1, tabSection2]
            });

            $('body').append(tab.$el);
        });
        it('해당 버튼에 active클래스가 추가되어있다', function() {
            var buttons;

            buttons = $('button');

            expect($(buttons[1]).hasClass('active')).toBe(true);
        });

        it('해당 섹션에 active클래스가 추가되어있다', function() {
            expect($('div').eq(1).hasClass('active')).toBe(true);
        });
    });

    describe('섹션의 활성화', function() {
        var tabSection1,
            tabSection2;
        beforeEach(function() {
            tabSection1 = $('<div>tab1</div>');
            tabSection2 = $('<div>tab2</div>');

            $('body').append(tabSection1);
            $('body').append(tabSection2);

            tab = new Tab({
                items: ['tab1', 'tab2'],
                sections: [tabSection1, tabSection2]
            });

            $('body').append(tab.$el);
        });

        it('섹션에 .active 클래스가 추가된다', function() {
            $('button').eq(1).trigger('click');
            expect(tabSection2.hasClass('active')).toBe(true);
        });

        it('기본섹션의  .active 클래스는 삭제되고 새로 선택된 섹션에 추가된다', function() {
            $('button').eq(0).trigger('click');
            $('button').eq(1).trigger('click');

            expect(tabSection1.hasClass('active')).toBe(false);
            expect(tabSection2.hasClass('active')).toBe(true);
        });
    });

    describe('.activate()', function() {
        beforeEach(function() {
            tab = new Tab({
                items: ['tab1', 'tab2']
            });

            $('body').append(tab.$el);
        });

        it('특정 버튼을 활성화한다', function() {
            tab.activate('tab1');

            expect($('button:contains("tab1")').hasClass('active')).toBe(true);
        });
    });
});
