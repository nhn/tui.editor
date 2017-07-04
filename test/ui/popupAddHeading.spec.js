const PopupAddHeading = require('../../src/js/ui/popupAddHeading');
const EventManager = require('../../src/js/eventManager');

describe('PopupAddHeading', () => {
    let popup,
        em;

    beforeEach(() => {
        $('body').append('<button class="tui-heading"></button>');

        em = new EventManager();

        popup = new PopupAddHeading({
            eventManager: em,
            $button: $('button.tui-heading')
        });
    });

    afterEach(() => {
        $('body').empty();
    });

    describe('init', () => {
        it('created element with opupAddHeading class', () => {
            expect(popup.$el.hasClass('te-heading-add')).toBe(true);
        });
    });

    describe('editor event', () => {
        let handler;

        beforeEach(() => {
            handler = jasmine.createSpy('buttonClickedHandler');
        });

        it('emits event on selecting item', () => {
            em.listen('command', handler);
            popup.$el.find('li').eq(0).trigger('click');
            expect(handler).toHaveBeenCalledWith('Heading', 1);

            popup.$el.find('li').eq(1).trigger('click');
            expect(handler).toHaveBeenCalledWith('Heading', 2);
        });

        it('shows popup on openHeadingSelect event', () => {
            em.emit('openHeadingSelect');

            expect(popup.isShow()).toBe(true);
        });

        it('hide popup on closeAllPopup event', () => {
            em.emit('openHeadingSelect');
            em.emit('closeAllPopup');

            expect(popup.isShow()).toBe(false);
        });
    });
});
