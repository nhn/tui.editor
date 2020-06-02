/**
 * @fileoverview test code block manager
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { CodeBlockManager } from '@/codeBlockManager';

describe('CodeBlockManager', () => {
  let codeBlockManager;

  beforeEach(() => {
    codeBlockManager = new CodeBlockManager();
  });

  describe('setReplacer', () => {
    it('sets replacer for code block element', () => {
      const replacer = {
        viewer: true
      };

      expect(codeBlockManager.getReplacer('tui.grid')).toBeUndefined();

      codeBlockManager.setReplacer('tui.grid', replacer);

      expect(codeBlockManager.getReplacer('tui.grid')).toBe(replacer);
    });

    it('saves the replacer name in lowercase', () => {
      const replacer = {};

      codeBlockManager.setReplacer('UML', replacer);
      expect(codeBlockManager.getReplacer('uml')).toBe(replacer);

      codeBlockManager.setReplacer('Uml', replacer);
      expect(codeBlockManager.getReplacer('uml')).toBe(replacer);
    });
  });

  describe('createCodeBlockHtml', () => {
    it('creates a code block html when there is a registered replacer', () => {
      const replacer = codeText => `replaced ${codeText} here`;

      codeBlockManager.setReplacer('awesome-languages', replacer);

      const actual = codeBlockManager.createCodeBlockHtml('awesome-languages', 'var a = 1;');
      const expected = 'replaced var a = 1; here';

      expect(actual).toBe(expected);
    });

    it('creates code block html if there is no registered replacer and not highlight.js type', () => {
      const actual = codeBlockManager.createCodeBlockHtml('tui.grid', 'var a = 1;');
      const expected = 'var a = 1;';

      expect(actual).toBe(expected);
    });

    it('converts the language name to lowercase and call the replacer with it', () => {
      const replacer = jasmine.createSpy('replacer');

      codeBlockManager.setReplacer('PlantUML', replacer);
      codeBlockManager.createCodeBlockHtml('PlantUML', 'foo');

      expect(replacer.calls.mostRecent().args[1]).toBe('plantuml');
    });
  });
});
