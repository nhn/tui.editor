var PopupAddLink = require('../src/js/popupAddLink');

describe('PopupAddLink', function() {
    'use strict';

    var popup;

    beforeEach(function() {
        $('body').empty();

        popup = new PopupAddLink();
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

    describe('이벤트의 발생', function() {
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

    describe('입력된 값의 데이터를 가져올 수 있다', function() {
        it('getValue()로 입력된 값을 객체형식으로 받는다', function() {
            var value;

            $('.linkTextInput').val('myLinkText');
            $('.urlInput').val('myUrl');

            value = popup.getValue();

            expect(value.linkText).toEqual('myLinkText');
            expect(value.url).toEqual('myUrl');
        });
    });
});
