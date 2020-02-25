/**
 * @fileoverview Implements toolbar
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import ToolbarDivider from '@/ui/toolbarDivider';

describe('ToolbarDivider', () => {
  describe('constructor', () => {
    it('should be named "divider"', () => {
      const divider = new ToolbarDivider();

      expect(divider.getName()).toBe(ToolbarDivider.name);
    });

    it('should have a div element with divider class', () => {
      const divider = new ToolbarDivider();

      expect(divider.el.nodeName).toBe('DIV');
      expect(divider.el.className).toBe(ToolbarDivider.className);
    });
  });
});
