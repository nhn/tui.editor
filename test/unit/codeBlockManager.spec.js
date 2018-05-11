/**
 * @fileoverview test code block manager
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import {CodeBlockManager} from '../../src/js/codeBlockManager';

describe('CodeBlockManager', () => {
  let codeBlockManager;

  beforeEach(() => {
    codeBlockManager = new CodeBlockManager();
  });

  describe('setReplacer', () => {
    it('set replacer for code block element', () => {
      const type = 'tui.grid';
      const replacer = {
        viewer: true
      };

      expect(codeBlockManager.getReplacer(type)).toBeUndefined();

      codeBlockManager.setReplacer(type, replacer);

      expect(codeBlockManager.getReplacer(type)).toBe(replacer);
    });
  });

  describe('createCodeBlockHtml', () => {
    it('Create a code block html when there is a registered replacer.', () => {
      const type = 'awesome-languages';
      const replacer = codeText => `replaced ${codeText} here`;

      codeBlockManager.setReplacer(type, replacer);

      const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
      const expected = 'replaced var a = 1; here';

      expect(actual).toBe(expected);
    });

    it('Create code block html for highlight.js type without replacer.', () => {
      const type = 'javascript';
      const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
      const expected = '<span class="hljs-keyword">var</span> a = <span class="hljs-number">1</span>;';

      expect(actual).toBe(expected);
    });

    it('Create code block html if there is no registered replacer and not highlight.js type.', () => {
      const type = 'tui.grid';
      const actual = codeBlockManager.createCodeBlockHtml(type, 'var a = 1;');
      const expected = 'var a = 1;';

      expect(actual).toBe(expected);
    });
  });
});
