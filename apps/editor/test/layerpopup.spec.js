var Layerpopup = require('../src/js/layerpopup');

describe('Layerpopup', function() {
    'use strict';

    var CLASS_PREFIX = Layerpopup.CLASS_PREFIX;

    beforeEach(function() {
        $('body').empty();
    });

    describe('팝업이 들어갈 타겟 엘리먼트를 정한다', function() {
        it('옵션으로 전달된 $target이 내부 어트리뷰트 $target 으로 만들어졌다.', function() {
            var popup;

            $('body').html('<div class="container" />');

            popup = new Layerpopup({
                $target: $('.container')
            });

            popup.render();

            expect(popup.$target.hasClass('container')).toBe(true);
        });

        it('타겟이 전달되면 팝업이 타겟으로 붙는다', function() {
        });
    });

    describe('팩토리를 이용해 외부 팝업 HTML을 팝업화한다', function() {
        var popup;

        beforeEach(function() {
            $('body').html(Layerpopup.prototype.layoutTemplate);

            popup = Layerpopup.popupfy({
                $el: $('.' + CLASS_PREFIX + 'wrapper')
            });
        });

        it('옵션으로 전달된 $el이 내부 $el로 지정된다', function() {
            expect(popup.$el.hasClass(CLASS_PREFIX + 'wrapper')).toBe(true);
        });

        it('외부 HTML을 이용하는경우 컨텐트옵션을 이용하지 않는다', function() {
            $('body').html(Layerpopup.prototype.layoutTemplate);

            popup = Layerpopup.popupfy({
                $el: $('.' + CLASS_PREFIX + 'wrapper'),
                content: $('<p>test</p>')
            });

            expect(popup.$target.find('p').length).toBe(0);
        });
    });

    describe('기본레이아웃을 이용한다', function() {
        it('자체 생성 팝업 HTML의 각 클래스네임별로 엘리먼트들이 존재한다.', function() {
            var popup = new Layerpopup();
            popup.render();

            expect(popup.$target.find('.' + CLASS_PREFIX + 'wrapper').length).toBe(1);
            expect(popup.$target.find('.' + CLASS_PREFIX + 'header').length).toBe(1);
            expect(popup.$target.find('.' + CLASS_PREFIX + 'body').length).toBe(1);
            expect(popup.$target.find('.' + CLASS_PREFIX + 'closeButton').length).toBe(1);
        });

        it('className을 옵션으로 전달하면 래퍼 엘리먼트에 해당 클래스네임을 추가한다', function() {
            var popup = new Layerpopup({
                className: 'myclass'
            });
            popup.render();

            expect(popup.$el.hasClass('myclass')).toBe(true);
        });

        it('텍스트 컨텐트를 전달받아 그린다', function() {
            var popup = new Layerpopup({
                textContent: 'text'
            });

            popup.render();

            expect(popup.$el.find('.' + CLASS_PREFIX + 'body').text()).toEqual('text');
        });

        it('컨텐트를 텍스트 태그형태로 전달받아서 그린다', function() {
            var popup = new Layerpopup({
                content: '<p>test</p>'
            });

            popup.render();

            expect(popup.$target.find('p').length).toBe(1);
        });

        it('컨텐트를 제이쿼리형태로 전달받아서 그린다', function() {
            var popup = new Layerpopup({
                content: $('<p>test</p>')
            });

            popup.render();

            expect(popup.$target.find('p').length).toBe(1);
        });

        it('타이틀을 전달받아 그린다', function() {
            var popup = new Layerpopup({
                title: 'mytitle'
            });

            popup.render();

            expect($('.' + CLASS_PREFIX + 'title').text()).toEqual('mytitle');
        });
    });

    describe('setContent', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup();
            popup.render();
        });

        it('컨텐트를 변경한다', function() {
            popup.setContent('text');
            expect(popup.$el.find('.' + CLASS_PREFIX + 'body').text()).toEqual('text');
        });
        it('컨텐트가 이미 있다면 지우고 변경한다', function() {
            popup.setContent('text');
            popup.setContent('text');
            expect(popup.$el.find('.' + CLASS_PREFIX + 'body').text()).toEqual('text');
        });
    });

    describe('setTitle', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup();
            popup.render();
        });

        it('타이틀을 변경한다', function() {
            popup.setTitle('title');
            expect($('.' + CLASS_PREFIX + 'title').text()).toEqual('title');
        });

        it('타이틀이 이미 있다면 지우고  변경한다', function() {
            popup.setTitle('titleBefore');
            popup.setTitle('title');
            expect($('.' + CLASS_PREFIX + 'title').text()).toEqual('title');
        });
    });

    describe('내부의 ' + CLASS_PREFIX + 'closeButton란 클래스가 붙은 엘리먼트가 클릭되면 팝업이 닫힌다', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup();
            popup.render();
        });

        it('클릭이벤트가 발생되어 layerpopup이 사라진다', function() {
            popup.show();
            expect(popup.isShow()).toBe(true);

            $('.' + CLASS_PREFIX + 'closeButton').trigger('click');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('CSS 셀렉터를 옵션으로 받아 팝업을 오픈하는 버튼을 지정할수 있다', function() {
        var popup;

        beforeEach(function() {
            $('body').append($('<button class="button1 openPopup"></button>'));
            $('body').append($('<button class="button2 openPopup"></button>'));

            popup = new Layerpopup({
                openerCssQuery: '.openPopup'
            });

            popup.render();
        });

        it('옵션에 해당되는 엘리먼트가 클릭되면 팝업의 show된다.', function() {
            $('.button1').trigger('click');
            expect(popup.isShow()).toBe(true);
            popup.hide();

            $('.button2').trigger('click');
            expect(popup.isShow()).toBe(true);
        });
    });

    describe('CSS 셀렉터를 옵션으로 받아 팝업을 닫는 버튼을 지정할수 있다', function() {
        var popup;

        beforeEach(function() {
            $('body').append($('<button class="button1 closePopup"></button>'));
            $('body').append($('<button class="button2 closePopup"></button>'));

            popup = new Layerpopup({
                closerCssQuery: '.closePopup'
            });

            popup.render();
        });

        it('옵션에 해당되는 엘리먼트가 클릭되면 팝업의 show된다.', function() {
            popup.show();
            $('.button1').trigger('click');
            expect(popup.isShow()).toBe(false);

            popup.show();
            $('.button2').trigger('click');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('팝업 노출과 숨기기', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup({
                $el: $('<div class="container" />')
            });

            popup.render();
        });

        it('show()로 팝업이 나타난다', function() {
            popup.hide();
            popup.show();

            expect(popup.$el.css('display')).toEqual('block');
            expect(popup.isShow()).toBe(true);
        });

        it('hide()로 팝업이 숨겨진다', function() {
            popup.show();
            popup.hide();

            expect(popup.$el.css('display')).toEqual('none');
            expect(popup.isShow()).toBe(false);
        });
    });

    describe('remove로 팝업을 DOM에서 삭제핧 수 있다', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup();
            popup.render();
        });

        it('래퍼 엘리먼트가 삭제된다', function() {
            popup.remove();
            expect($('.' + CLASS_PREFIX + 'wrapper').length).toBe(0);
        });
    });

    describe('remove객체가 지정한 이벤트들을 모두 해제 할수 있어야한다', function() {
        var popup;

        beforeEach(function() {
            $('body').append($('<button class="button1 openPopup"></button>'));

            popup = new Layerpopup({
                openerCssQuery: '.openPopup'
            });

            popup.render();
        });

        it('오프너 이벤트가 발생하지 않는다', function() {
            var button = $('.button1');
            popup.remove();
            button.trigger('click');
            expect(popup.isShow()).toBe(false);
        });

        it('closeButton이벤트가 발생하지 않는다', function() {
            var button = $('.' + CLASS_PREFIX + 'closeButton');
            popup.show();
            popup.remove();
            button.trigger('click');
            expect(popup.isShow()).toBe(true);
        });
    });

    describe('dim레이어를 추가 할수있다.', function() {
    });

    describe('커스텀 이벤트를 관리할 수 있다', function() {
        var popup;

        beforeEach(function() {
            popup = new Layerpopup();
            popup.render();
        });

        it('이벤트가 발생된다', function() {
            var spy = jasmine.createSpy('spy');
            popup.on('cev', spy);
            popup.trigger('cev');

            expect(spy).toHaveBeenCalled();
        });

        it('이벤트가 제거된다', function() {
            var spy = jasmine.createSpy('spy');
            popup.on('cev', spy);
            popup.off('cev');
            popup.trigger('cev');

            expect(spy).not.toHaveBeenCalled();
        });
    });
});

