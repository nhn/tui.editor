/**
 * @fileoverview test ui popup code block editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import PopupCodeBlockEditor from '@/ui/popupCodeBlockEditor';
import EventManager from '@/eventManager';
import Convertor from '@/convertor';

describe('PopupCodeBlockEditor', () => {
  let eventManager, popup, pre;

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
    document.body.innerHTML = '';
  });

  it('should not be opened without code block element', () => {
    const openPopup = () => eventManager.emit('openPopupCodeBlockEditor');

    expect(openPopup).toThrow();
  });

  it('should open popup as modal', () => {
    eventManager.emit('openPopupCodeBlockEditor', pre);
    expect(popup.el).toHaveClass('tui-popup-modal-background');
  });
});
