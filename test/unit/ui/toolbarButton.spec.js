/**
 * @fileoverview test toolbar button
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import ToolbarButton from '../../../src/js/ui/toolbarButton';
import EventManager from '../../../src/js/eventManager';

describe('ToolbarButton', () => {
  let toolbarButton, eventManager;

  describe('toggle', () => {
    beforeEach(() => {
      eventManager = new EventManager();
    });

    afterEach(() => {
      toolbarButton.destroy();
      toolbarButton = null;
    });

    it('should be disabled if corresponding state is false', () => {
      toolbarButton = new ToolbarButton({
        name: 'test',
        enableOn: ['state1']
      }, eventManager);

      eventManager.emit('stateChange', {
        state1: false
      });

      expect(toolbarButton.isEnabled()).toBe(false);
    });

    it('should be enabled if corresponding state is true', () => {
      toolbarButton = new ToolbarButton({
        name: 'test',
        enableOn: ['state1']
      }, eventManager);

      eventManager.emit('stateChange', {
        state1: true
      });

      expect(toolbarButton.isEnabled()).toBe(true);
    });
  });

  describe('enable/disable', () => {
    it('should remove/add disabled attr', () => {
      toolbarButton = new ToolbarButton({});

      toolbarButton.disable();
      expect(toolbarButton.$el.attr('disabled')).toBeTruthy();

      toolbarButton.enable();
      expect(toolbarButton.$el.attr('disabled')).toBeFalsy();
    });
  });
});
