'use strict';

var PopupAddImage = require('../../src/js/ui/popupAddImage'),
    EventManager = require('../../src/js/eventManager');

describe('PopupAddImage', function() {
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
            expect(popup.$el.hasClass('te-popup-add-image')).toBe(true);
        });
        it('버튼들이 생성되었다', function() {
            expect(popup.$el.find('.te-close-button').length).toEqual(1);
            expect(popup.$el.find('.te-ok-button').length).toEqual(1);
        });
    });

    describe('이벤트의 발생', function() {
        var handler;

        beforeEach(function() {
            handler = jasmine.createSpy('buttonClickedHandler');
        });

        it('ok버튼을 누르면 okButtonClicked이벤트가 발생한다', function() {
            popup.on('okButtonClicked', handler);

            $('.te-ok-button').trigger('click');

            expect(handler).toHaveBeenCalled();
        });

        it('close버튼을 누르면 closeButtonClicked이벤트가 발생한다', function() {
            popup.on('closeButtonClicked', handler);

            $('.te-close-button').trigger('click');

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

            $('.te-image-url-input').val(value.imageUrl);
            $('.te-alt-text-input').val(value.altText);

            $('.te-ok-button').trigger('click');

            expect(handler).toHaveBeenCalledWith('AddImage', value);
        });

        it('eventManager에서 openPopupAddImage 이벤트가 발생하면 팝업이 보여진다', function() {
            em.emit('openPopupAddImage');

            expect(popup.isShow()).toBe(true);
        });

        it('eventManager에서 closeAllPopup 이벤트가 발생하면 팝업이 닫힌다', function() {
            em.emit('openPopupAddImage');
            em.emit('closeAllPopup');

            expect(popup.isShow()).toBe(false);
        });
    });

    describe('url입력 방식', function() {
        it('getValue()로 입력된 값들을 객체형식으로 받는다', function() {
            var value = {
                    imageUrl: 'imageUrlText',
                    altText: 'altText'
                };

            $('.te-image-url-input').val('imageUrlText');
            $('.te-alt-text-input').val('altText');

            expect($('.te-image-url-input').val()).toEqual(value.imageUrl);
            expect($('.te-alt-text-input').val()).toEqual(value.altText);
        });

        it('팝업이 닫히면 입력된값들이 초기화 인풋의 값들이 리셋된다', function() {
            $('.te-image-url-input').val('imageUrlText');
            $('.te-alt-text-input').val('altText');

            popup.hide();

            expect($('.te-image-url-input').val()).toEqual('');
            expect($('.te-alt-text-input').val()).toEqual('');
        });

        it('when tab has changed then reset inputs', function() {
            $('.te-image-url-input').val('imageUrlText');
            $('.te-alt-text-input').val('altText');

            popup.$el.find('.te-tab button').eq(1).trigger('click');

            expect($('.te-image-url-input').val()).toEqual('');
            expect($('.te-alt-text-input').val()).toEqual('');
        });
    });

    describe('image입력 방식', function() {
        describe('ok버튼이 클릭', function() {
            it('addImageBlobHook을 실행한다.', function() {
                var hook = jasmine.createSpy('addImageBlobHook');
                em.listen('addImageBlobHook', hook);

                $('.te-ok-button').trigger('click');

                expect(hook).toHaveBeenCalled();
            });

            it('addImageBlobHook에 전달되는 콜백으로 완성된 url을 비동기로 전달하면 AddImage 커맨드 이벤트가 발생하고 팝업이hide된다', function(done) {
                var addImage = jasmine.createSpy('addImage'),
                    value = {
                        imageUrl: 'imageUrlText',
                        altText: 'altText'
                    };

                em.listen('command', function(type, imageValue) {
                    addImage(imageValue);
                });

                em.listen('addImageBlobHook', function(fileBlob, callback) {
                    setTimeout(function() {
                        callback(value.imageUrl);
                        expect(addImage).toHaveBeenCalledWith({imageUrl: value.imageUrl, altText: value.altText});
                        expect(popup.isShow()).toBe(false);
                        done();
                    }, 0);
                });

                $('.te-alt-text-input').val(value.altText);

                $('.te-ok-button').trigger('click');
            });
        });
    });
});
