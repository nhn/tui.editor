var PopupAddImage = require('../src/js/popupAddImage'),
    EventManager = require('../src/js/eventManager');

describe('PopupAddImage', function() {
    'use strict';

    var popup,
        em;

    beforeEach(function() {
        $('body').empty();

        em = new EventManager();

        popup = new PopupAddImage({
            eventManager: em
        });
    });

    describe('생성', function() {
        it('PopupAddImage클래스가 추가되었다', function() {
            expect(popup.$el.hasClass('popupAddImage')).toBe(true);
        });
        it('버튼들이 생성되었다', function() {
            expect(popup.$el.find('.closeButton').length).toEqual(1);
            expect(popup.$el.find('.okButton').length).toEqual(1);
        });
    });

    describe('이벤트의 발생', function() {
        var handler;

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
                    imageUrl: 'imageUrlText',
                    altText: 'altText'
                };

            em.listen('command', handler);
            $('.imageUrlInput').val(value.imageUrl);
            $('.altTextInput').val(value.altText);

            $('.okButton').trigger('click');

            expect(handler).toHaveBeenCalledWith('AddImage', value);
        });

        it('eventManager에서 openPopupAddImage 이벤트가 발생하면 팝업이 보여진다', function() {
            em.emit('openPopupAddImage');

            expect(popup.isShow()).toBe(true);
        });
    });

    describe('입력된 값의 데이터를 가져올 수 있다', function() {
        it('getValue()로 입력된 값을 객체형식으로 받는다', function() {
            var value;

            $('.imageUrlInput').val('imageUrlText');
            $('.altTextInput').val('altText');

            value = popup.getValue();

            expect(value.imageUrl).toEqual('imageUrlText');
            expect(value.altText).toEqual('altText');
        });
    });
});
