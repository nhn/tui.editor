var PopupAddLink = require('../src/js/popupAddLink');

describe('', function() {
    'use strict';

    var popup;

    beforeEach(function() {
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

    describe('OK 버튼을 누르면 addLink이벤트를 발생 시킨다', function() {
    });

    describe('Cancel 버튼으로 팝업을 닫는다', function() {
    });
});
