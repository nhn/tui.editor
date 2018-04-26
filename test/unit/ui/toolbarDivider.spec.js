/**
 * @fileoverview Implements toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import ToolbarDivider from '../../../src/js/ui/toolbarDivider';

describe('ToolbarDivider', () => {
  describe('constructor', () => {
    it('should be named "divider"', () => {
      const divider = new ToolbarDivider();

      expect(divider.getName()).toBe(ToolbarDivider.name);
    });

    it('should have a div element with divider class', () => {
      const divider = new ToolbarDivider();

      expect(divider.$el.prop('tagName')).toBe('DIV');
      expect(divider.$el.hasClass(ToolbarDivider.className)).toBe(true);
    });
  });
});
