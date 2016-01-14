'use strict';

var PopupAddHeading = require('../../src/js/ui/popupAddHeading'),
    EventManager = require('../../src/js/eventManager');

describe('PopupAddHeading', function() {
    var popup,
        em;

    beforeEach(function() {
        $('body').append('<button class="tui-heading"></button>');

        em = new EventManager();

        popup = new PopupAddHeading({
            eventManager: em,
            $button: $('button.tui-heading')
        });

        popup._bindEvent();
    });

    afterEach(function() {
        $('body').empty();
    });

    describe('생성', function() {
        it('PopupAddHeading클래스 추가되었다', function() {
            expect(popup.$el.hasClass('te-heading-add')).toBe(true);
        });
    });

    describe('eventManager와 연결', function() {
        var handler;

        beforeEach(function() {
            handler = jasmine.createSpy('buttonClickedHandler');
        });

        it('해딩을 선택하는 li를 클릭하면 이벤트가 발생한다.', function() {

            em.listen('command', handler);
            popup.$el.find('li').eq(0).trigger('click');
            expect(handler).toHaveBeenCalledWith('Heading', 1);

            popup.$el.find('li').eq(1).trigger('click');
            expect(handler).toHaveBeenCalledWith('Heading', 2);
        });

        it('eventManager에서 openHeadingSelect 이벤트가 발생하면 팝업이 보여진다', function() {
            em.emit('openHeadingSelect');

            expect(popup.isShow()).toBe(true);
        });

        it('eventManager에서 closeAllPopup 이벤트가 발생하면 팝업이 닫힌다', function() {
            em.emit('openHeadingSelect');
            em.emit('closeAllPopup');

            expect(popup.isShow()).toBe(false);
        });
    });

});
