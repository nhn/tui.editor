var PopupAddLink = require('../src/js/popupAddLink'),
    EventManager = require('../src/js/eventManager');

describe('PopupAddLink', function() {
    'use strict';

    var popup,
        em;

    beforeEach(function() {
        $('body').empty();

        em = new EventManager();

        popup = new PopupAddLink({
            eventManager: em
        });
    });

    describe('생성', function() {
        it('popupAddLink클래스가 추가되었다', function() {
            expect(popup.$el.hasClass('popupAddLink')).toBe(true);
        });
        it('버튼들이 생성되었다', function() {
            expect(popup.$el.find('.closeButton').length).toEqual(1);
            expect(popup.$el.find('.okButton').length).toEqual(1);
        });
    });

    describe('버튼 이벤트', function() {
        var handler = jasmine.createSpy('buttonClickedHandler');

        beforeEach(function() {
            handler = jasmine.createSpy('buttonClickedHandler');
        });

        it('ok버튼을 누르면 okButtonClicked이벤트가 발생한다', function() {
            popup.on('okButtonClicked', handler);

            $('.okButton').trigger('click');

            expect(handler).toHaveBeenCalled();
        });

        it('close버튼을 누르면 closeButtonClicked이벤트가 발생한다', function() {
            popup.on('closeButtonClicked', handler);

            $('.closeButton').trigger('click');

            expect(handler).toHaveBeenCalled();
        });
    });

    describe('eventManager와 연결', function() {
        var handler;

        beforeEach(function() {
            handler = jasmine.createSpy('buttonClickedHandler');
        });

        it('okButtonClicked이벤트가 발생하면 eventManager의 command 이벤트가 발생한다', function() {
            var value = {
                    linkText: 'linkText',
                    url: 'urlText'
                };

            em.listen('command', handler);
            $('.linkTextInput').val(value.linkText);
            $('.urlInput').val(value.url);

            $('.okButton').trigger('click');

            expect(handler).toHaveBeenCalledWith('AddLink', value);
        });

        it('eventManager에서 openPopupAddLink 이벤트가 발생하면 팝업이 보여진다', function() {
            em.emit('openPopupAddLink');

            expect(popup.isShow()).toBe(true);
        });

        it('eventManager에서 closeAllPopup 이벤트가 발생하면 팝업이 닫힌다', function() {
            em.emit('openPopupAddLink');
            em.emit('closeAllPopup');

            expect(popup.isShow()).toBe(false);
        });
    });

    describe('url입력 방식', function() {
        it('getValue()로 입력된 값들을 객체형식으로 받는다', function() {
            var value;

            $('.linkTextInput').val('myLinkText');
            $('.urlInput').val('myUrl');

            value = popup.getValue();

            expect(value.linkText).toEqual('myLinkText');
            expect(value.url).toEqual('myUrl');
        });

        it('팝업이 닫히면 입력된값들이 초기화 인풋의 값들이 ""로 변경된다', function() {
            var value;

            $('.linkTextInput').val('myLinkText');
            $('.urlInput').val('myUrl');

            popup.hide();
            value = popup.getValue();

            expect(value.linkText).toEqual('');
            expect(value.url).toEqual('');
        });
    });

    describe('file입력 방식', function() {
        it('', function() {

        });
    });
});
