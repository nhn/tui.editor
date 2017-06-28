/* eslint max-nested-callbacks:0 new-cap:0 */

import PopupCodeBlockEditor from '../../src/js/ui/popupCodeBlockEditor';
import EventManager from '../../src/js/eventManager';
import Convertor from '../../src/js/convertor';

describe('PopupCodeBlockEditor', () => {
    let eventManager,
        popup,
        pre;

    beforeEach(() => {
        eventManager = new EventManager();
        const convertor = new Convertor(eventManager);
        popup = new PopupCodeBlockEditor({
            eventManager,
            convertor
        });
        pre = document.createElement('pre');
    });

    afterEach(() => {
        $('body').empty();
    });

    it('should not be opened without code block element', () => {
        const openPopup = () => eventManager.emit('openPopupCodeBlockEditor');
        expect(openPopup).toThrow();
    });

    it('should open popup as modal', () => {
        eventManager.emit('openPopupCodeBlockEditor', pre);
        expect(popup.$el.hasClass('tui-popup-modal-background')).toBe(true);
    });
});
