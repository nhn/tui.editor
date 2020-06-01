/**
 * @fileoverview test editor
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import * as util from '@/utils/common';

import Editor from '@/editor';
import Convertor from '@/convertor';
import { CodeBlockManager } from '@/codeBlockManager';

import WwCodeBlockManager from '@/wwCodeBlockManager';
import WwTableManager from '@/wwTableManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';
import CommandManager from '@/commandManager';

describe('Editor', () => {
  let editor, container;

  describe('module export', () => {
    it('codeBlockManager should be CodeBlockManager instance', () => {
      expect(Editor.codeBlockManager instanceof CodeBlockManager).toBe(true);
    });

    it('WwCodeBlockManager should be WwCodeBlockManager class', () => {
      expect(Editor.WwCodeBlockManager).toBe(WwCodeBlockManager);
    });

    it('WwTableManager should be WwTableManager class', () => {
      expect(Editor.WwTableManager).toBe(WwTableManager);
    });

    it('CommandManager should be CommandManager class', () => {
      expect(Editor.CommandManager).toBe(CommandManager);
    });

    it('WwTableSelectionManager should be WwTableSelectionManager class', () => {
      expect(Editor.WwTableSelectionManager).toBe(WwTableSelectionManager);
    });
  });

  describe('Api', () => {
    beforeEach(() => {
      jasmine.getStyleFixtures().fixturesPath = '/base';
      loadStyleFixtures('node_modules/codemirror/lib/codemirror.css', 'src/css/editor.css');
      container = document.createElement('div');
      document.body.appendChild(container);

      editor = new Editor({
        el: container,
        height: '300px',
        initialEditType: 'markdown'
      });
    });

    // we need to wait squire input event process
    afterEach(done => {
      setTimeout(() => {
        container.parentNode.removeChild(container);
        done();
      });
    });

    describe('changeMode()', () => {
      beforeEach(() => {
        container.parentNode.removeChild(container);
        container = document.createElement('div');
        document.body.appendChild(container);
        editor = new Editor({
          el: container,
          height: '300px',
          initialEditType: 'markdown',
          initialValue: 'text 1\ntext 2'
        });
      });

      it('should set focus and set cursor to end', () => {
        editor.changeMode('wysiwyg');

        const range = editor.wwEditor.getRange();

        expect(range.startContainer.textContent).toEqual('text 2');
        expect(container.contains(document.activeElement)).toEqual(true);

        document.activeElement.blur();
        editor.changeMode('markdown');

        const cursor = editor.mdEditor.getCursor();

        expect(cursor.line).toEqual(1);
        expect(cursor.ch).toEqual(6);
        expect(container.contains(document.activeElement)).toEqual(true);
      });

      it('should not set focus and cursor', () => {
        editor.changeMode('wysiwyg', true);

        const range = editor.wwEditor.getRange();

        expect(range.startContainer.textContent).toEqual('text 1');
        expect(range.startOffset).toEqual(0);
        expect(container.contains(document.activeElement)).toEqual(false);

        editor.changeMode('markdown', true);

        const cursor = editor.mdEditor.getCursor();

        expect(cursor.line).toEqual(0);
        expect(cursor.ch).toEqual(0);
        expect(container.contains(document.activeElement)).toEqual(false);
      });
    });

    describe('height(pixel)', () => {
      it('set editor height', () => {
        editor.height('500px');

        expect(container.offsetHeight).toEqual(500);
      });

      it('set editor height as pixel if given argument is a number', () => {
        editor.height(500);

        expect(container.offsetHeight).toEqual(500);
      });

      it('get editor height', () => {
        expect(editor.height()).toEqual('300px');
      });
    });

    describe('height("auto") and minHeight()', () => {
      it('set editor height "auto" to fit contents height of wysiwyg', () => {
        const height = document.querySelector('.te-ww-container .te-editor').clientHeight;

        editor.height('auto');
        editor.changeMode('wysiwyg');
        editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');

        expect(
          document.querySelector('.te-ww-container .tui-editor-contents').clientHeight
        ).not.toEqual(height);
      });

      it('set editor height "auto" to fit contents height of markdown', () => {
        const height = document.querySelector('.te-md-container .te-editor').clientHeight;

        editor.height('auto');
        editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');

        expect(
          document.querySelector('.te-md-container .tui-editor-contents').clientHeight
        ).not.toEqual(height);
      });

      it('default minHeight should be applied to editor height', () => {
        editor.height('auto');

        expect(container.offsetHeight).toBeGreaterThan(100);
      });

      it('should applied to editor height', () => {
        editor.height('auto');
        editor.minHeight('300px');

        expect(container.offsetHeight).toEqual(300);
      });
    });

    describe('setMarkdown()', () => {
      it('fire setMarkdownAfter evnet after setMarkdown', done => {
        editor.on('setMarkdownAfter', done);
        editor.setMarkdown('dd');
      });
    });

    describe('changePreviewStyle()', () => {
      it('Preview should refreash after preview style is changed', () => {
        editor.changePreviewStyle('tab');
        editor.setMarkdown('1\n2');
        editor.changePreviewStyle('vertical');

        expect(editor.preview.el.textContent).toEqual('1\n2\n');
      });
    });

    describe('insertText()', () => {
      it('insert text on markdown mode', () => {
        editor.changeMode('markdown');
        editor.insertText('text');

        expect(editor.getMarkdown()).toEqual('text');
      });

      it('insert text on wysiwyg mode', () => {
        editor.changeMode('wysiwyg');
        editor.insertText('text');

        expect(editor.getMarkdown()).toEqual('text');
      });
    });

    describe('getSelectedText()', () => {
      it('retrieve selected text on markdown', () => {
        editor.changeMode('markdown');
        editor.setMarkdown('selected text');

        editor.mdEditor.cm.setSelection(
          {
            line: 0,
            ch: 9
          },
          {
            line: 0,
            ch: 13
          }
        );

        expect(editor.getSelectedText()).toEqual('text');
      });

      it('retrieve selected text on wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setHtml('selected text');

        const { wwEditor } = editor;
        const selection = wwEditor.editor.getSelection().cloneRange();
        const textElement = wwEditor.getBody().querySelector('div').firstChild;

        selection.setStart(textElement, 9);
        selection.setEnd(textElement, 13);
        wwEditor.editor.setSelection(selection);

        expect(editor.getSelectedText()).toEqual('text');
      });
    });
  });

  describe('xss', () => {
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    // we need to wait squire input event process
    afterEach(done => {
      setTimeout(() => {
        container.parentNode.removeChild(container);
        done();
      });
    });

    xit('should sanitize html', () => {
      editor = new Editor({
        el: container,
        height: '300px',
        initialEditType: 'markdown'
      });

      const xss = '<script>alert("xss");</script>';

      editor.setMarkdown(xss);

      const content = editor.preview.getHTML().trim();

      expect(content).toBe('');
    });

    it('should not sanitize html if useDefaultHTMLSanitizer is false', () => {
      editor = new Editor({
        el: container,
        height: '300px',
        initialEditType: 'markdown',
        useDefaultHTMLSanitizer: false
      });

      const xss = '<script>alert("xss");</script>';

      editor.setMarkdown(xss);

      const content = editor.getHtml().trim();

      expect(content).toBe('<script data-tomark-pass="">alert("xss");</script>');
    });
  });

  describe('options', () => {
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(done => {
      setTimeout(() => {
        editor.remove();
        container.parentNode.removeChild(container);
        done();
      });
    });

    describe('plugins', () => {
      it('should invoke plugin functions', () => {
        const fooPlugin = jasmine.createSpy('fooPlugin');
        const barPlugin = jasmine.createSpy('barPlugin');

        editor = new Editor({
          el: container,
          plugins: [fooPlugin, barPlugin]
        });

        expect(fooPlugin).toHaveBeenCalledWith(editor);
        expect(barPlugin).toHaveBeenCalledWith(editor);
      });

      it('should invoke plugin function with options of plugin', () => {
        const plugin = jasmine.createSpy('plugin');
        const options = {};

        editor = new Editor({
          el: container,
          plugins: [[plugin, options]]
        });

        expect(plugin).toHaveBeenCalledWith(editor, options);
      });

      it('should extract plugin function with options of plugin object', () => {
        const plugin = jasmine.createSpy('plugin');
        const options = {};
        const pluginInfo = { pluginFn: plugin };

        editor = new Editor({
          el: container,
          plugins: [[pluginInfo, options]]
        });

        expect(plugin).toHaveBeenCalledWith(editor, options);
      });
    });

    describe('usageStatistics', () => {
      it('should send request hostname in payload by default', () => {
        spyOn(util, 'sendHostName');

        editor = new Editor({
          el: container
        });

        expect(util.sendHostName).toHaveBeenCalled();
      });

      it('should not send request if the option is set to false', () => {
        spyOn(util, 'sendHostName');

        editor = new Editor({
          el: container,
          usageStatistics: false
        });

        expect(util.sendHostName).not.toHaveBeenCalled();
      });
    });

    describe('toolbaritems', () => {
      it('should populate default toolbar items', () => {
        editor = new Editor({
          el: container
        });

        const toolbarItems = editor
          .getUI()
          .getToolbar()
          .getItems();

        expect(toolbarItems[0].getName()).toBe('heading');
        expect(toolbarItems[1].getName()).toBe('bold');
        expect(toolbarItems[2].getName()).toBe('italic');
        expect(toolbarItems[3].getName()).toBe('strike');
        expect(toolbarItems[4].getName()).toBe('divider');
        expect(toolbarItems[5].getName()).toBe('hr');
        expect(toolbarItems[6].getName()).toBe('quote');
        expect(toolbarItems[7].getName()).toBe('divider');
        expect(toolbarItems[8].getName()).toBe('ul');
        expect(toolbarItems[9].getName()).toBe('ol');
        expect(toolbarItems[10].getName()).toBe('task');
        expect(toolbarItems[11].getName()).toBe('indent');
        expect(toolbarItems[12].getName()).toBe('outdent');
        expect(toolbarItems[13].getName()).toBe('divider');
        expect(toolbarItems[14].getName()).toBe('table');
        expect(toolbarItems[15].getName()).toBe('image');
        expect(toolbarItems[16].getName()).toBe('link');
        expect(toolbarItems[17].getName()).toBe('divider');
        expect(toolbarItems[18].getName()).toBe('code');
        expect(toolbarItems[19].getName()).toBe('codeblock');
      });

      it('should populate custom toolbar buttons according to given array', () => {
        editor = new Editor({
          el: container,
          toolbarItems: [
            'bold',
            'divider',
            {
              type: 'button',
              options: {
                name: 'testButton'
              }
            },
            {
              type: 'item',
              options: {
                name: 'testItem'
              }
            }
          ]
        });

        const toolbarItems = editor
          .getUI()
          .getToolbar()
          .getItems();

        expect(toolbarItems[0].getName()).toBe('bold');
        expect(toolbarItems[1].getName()).toBe('divider');
        expect(toolbarItems[2].getName()).toBe('testButton');
        expect(toolbarItems[3].getName()).toBe('testItem');
      });
    });

    describe('hideModeSwitch', () => {
      it('should hide mode switch if the option value is true', () => {
        editor = new Editor({
          el: container,
          hideModeSwitch: true
        });

        const modeSwitch = editor.getUI().getModeSwitch();

        expect(modeSwitch.isShown()).toBe(false);
      });

      it('should hide mode switch if the option value is true', () => {
        editor = new Editor({
          el: container
        });

        const modeSwitch = editor.getUI().getModeSwitch();

        expect(modeSwitch.isShown()).toBe(true);
      });
    });

    describe('customConvertor', () => {
      it('should use default convertor if the option value is not set', () => {
        editor = new Editor({
          el: container
        });
        expect(editor.convertor instanceof Convertor).toBe(true);
      });

      it('should use custom convertor if the option value is set', () => {
        const CustomConvertor = class extends Convertor {};

        editor = new Editor({
          el: container,
          customConvertor: CustomConvertor
        });
        expect(editor.convertor instanceof Convertor).toBe(true);
        expect(editor.convertor instanceof CustomConvertor).toBe(true);
      });
    });

    describe('customHTMLRenderer', () => {
      it('should pass customHTMLRender option for creating convertor instance', () => {
        editor = new Editor({
          el: container,
          initialValue: 'Hello World',
          customHTMLRenderer: {
            paragraph(_, { entering, origin }) {
              const result = origin();

              if (entering) {
                result.classNames = ['my-class'];
              }

              return result;
            }
          }
        });

        expect(editor.getHtml()).toBe('<p class="my-class">Hello World</p>\n');
      });

      it('linkAttribute options should be applied to original renderer', () => {
        editor = new Editor({
          el: container,
          initialValue: '[Hello](nhn.com)',
          linkAttribute: { target: '_blank' },
          customHTMLRenderer: {
            link(_, { origin }) {
              return origin();
            }
          }
        });

        expect(editor.getHtml()).toBe('<p><a href="nhn.com" target="_blank">Hello</a></p>\n');
      });
    });

    describe('extendedAutolinks option', () => {
      it('should convert url-like strings to anchor tags', () => {
        editor = new Editor({
          el: container,
          initialValue: 'http://nhn.com',
          extendedAutolinks: true
        });

        expect(editor.getHtml()).toBe('<p><a href="http://nhn.com">http://nhn.com</a></p>\n');
      });
    });

    describe('referenceDefinition option', () => {
      it('referenceDefinition: false(default) - should not parse refererence definition node', () => {
        editor = new Editor({
          el: container,
          initialValue: '[foo]: test \n [foo]'
        });

        expect(editor.getHtml()).toBe('<p>[foo]: test<br>\n[foo]</p>\n');
      });

      it('referenceDefinition: true - should parse refererence definition node', () => {
        editor = new Editor({
          el: container,
          initialValue: '[foo]: test \n [foo]',
          referenceDefinition: true
        });

        expect(editor.getHtml()).toBe('<p><a href="test">foo</a></p>\n');
      });
    });

    describe('disallowDeepHeading internal parsing option', () => {
      it('should disallow the nested seTextHeading in list', () => {
        editor = new Editor({
          el: container,
          initialValue: '- item1\n\t-'
        });

        expect(editor.getHtml()).toBe('<ul>\n<li>item1<br>\n-</li>\n</ul>\n');
      });

      it('should disallow the nested atxHeading in list', () => {
        editor = new Editor({
          el: container,
          initialValue: '- # item1'
        });

        expect(editor.getHtml()).toBe('<ul>\n<li># item1</li>\n</ul>\n');
      });
      it('should disallow the nested seTextHeading in blockquote', () => {
        editor = new Editor({
          el: container,
          initialValue: '> item1\n> -'
        });

        expect(editor.getHtml()).toBe('<blockquote>\n<p>item1<br>\n-</p>\n</blockquote>\n');
      });

      it('should disallow the nested atxHeading in blockquote', () => {
        editor = new Editor({
          el: container,
          initialValue: '> # item1'
        });

        expect(editor.getHtml()).toBe('<blockquote>\n<p># item1</p>\n</blockquote>\n');
      });
    });

    describe('customHTMLSanitizer option', () => {
      it('should replace default sanitizer with custom sanitizer', () => {
        const customHTMLSanitizer = jasmine.createSpy('sanitizer');

        editor = new Editor({
          el: container,
          customHTMLSanitizer
        });
        editor.changeMode('wysiwyg');

        expect(customHTMLSanitizer).toHaveBeenCalled();
      });
    });
  });
});
