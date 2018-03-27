/**
 * @fileoverview Implements toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import Toolbar from '../../src/js/ui/toolbar';
import DefaultToolbar from '../../src/js/ui/defaultToolbar';
import EventManager from '../../src/js/eventManager';

describe('DefaultToolbar', () => {
  let eventManager;

  beforeEach(() => {
    eventManager = new EventManager();
  });

  describe('constructor', () => {
    it('should populate a DefaultToolbar instance including default items', () => {
      const defaultToolbar = new DefaultToolbar(eventManager);

      expect(defaultToolbar instanceof DefaultToolbar).toBe(true);
      expect(defaultToolbar instanceof Toolbar).toBe(true);

      const items = defaultToolbar.getItems();
      expect(items[0].getName()).toBe('heading');
      expect(items[1].getName()).toBe('bold');
      expect(items[2].getName()).toBe('italic');
      expect(items[3].getName()).toBe('strike');
      expect(items[4].getName()).toBe('divider');
      expect(items[5].getName()).toBe('hr');
      expect(items[6].getName()).toBe('quote');
      expect(items[7].getName()).toBe('ul');
      expect(items[8].getName()).toBe('ol');
      expect(items[9].getName()).toBe('task');
      expect(items[10].getName()).toBe('divider');
      expect(items[11].getName()).toBe('table');
      expect(items[12].getName()).toBe('image');
      expect(items[13].getName()).toBe('link');
      expect(items[14].getName()).toBe('divider');
      expect(items[15].getName()).toBe('code');
      expect(items[16].getName()).toBe('codeblock');
    });
  });
});
