/**
 * @fileoverview test editor
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import MarkdownIt from 'markdown-it';
import util from 'tui-code-snippet';

import Editor from '../../src/js/editor';
import Convertor from '../../src/js/convertor';
import {CodeBlockManager} from '../../src/js/codeBlockManager';
import {I18n} from '../../src/js/i18n';
import Button from '../../src/js/ui/button';
import WwCodeBlockManager from '../../src/js/wwCodeBlockManager';
import WwTableManager from '../../src/js/wwTableManager';
import WwTableSelectionManager from '../../src/js/wwTableSelectionManager';
import CommandManager from '../../src/js/commandManager';

describe('Editor', () => {
  let editor, container;

  describe('module export', () => {
    it('getMarkdownHighlightRenderer() should get MarkdownIt instance', () => {
      expect(Editor.markdownitHighlight instanceof MarkdownIt).toBe(true);
    });
    it('markdownitHighlight should be MarkdownIt instance', () => {
      expect(Editor.markdownitHighlight instanceof MarkdownIt).toBe(true);
    });
    it('domUtils should have it\' functions', () => {
      expect(typeof Editor.domUtils.getNodeName).toBe('function');
    });
    it('codeBlockManager should be CodeBlockManager instance', () => {
      expect(Editor.codeBlockManager instanceof CodeBlockManager).toBe(true);
    });
    it('i18n should be I18n instance', () => {
      expect(Editor.i18n instanceof I18n).toBe(true);
    });
    it('Button should be Button class', () => {
      expect(Editor.Button).toBe(Button);
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
      loadStyleFixtures(
        'node_modules/codemirror/lib/codemirror.css',
        'src/css/tui-editor.css'
      );
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
        const height = $('.te-ww-container .te-editor').height();
        editor.height('auto');
        editor.changeMode('wysiwyg');
        editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
        expect($('.te-ww-container .tui-editor-contents').height()).not.toEqual(height);
      });

      it('set editor height "auto" to fit contents height of markdown', () => {
        const height = $('.te-md-container .te-editor').height();
        editor.height('auto');
        editor.setMarkdown('1\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n2\n');
        expect($('.te-md-container .te-editor').height()).not.toEqual(height);
      });

      it('default minHeight should be applied to editor height', () => {
        editor.height('auto');

        const rect = container.getBoundingClientRect();
        expect(rect.bottom - rect.top).toBeGreaterThan(100);
      });

      it('should applied to editor height', () => {
        editor.height('auto');
        editor.minHeight('300px');

        const rect = container.getBoundingClientRect();
        expect(rect.bottom - rect.top).toEqual(300);
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
        expect(editor.preview.$el.text()).toEqual('1\n2\n');
      });
    });

    describe('insertText()', () => {
      it('insert text on markdown mode', () => {
        editor.changeMode('markdown');
        editor.insertText('text');
        expect(editor.getValue()).toEqual('text');
      });

      it('insert text on wysiwyg mode', () => {
        editor.changeMode('wysiwyg');
        editor.insertText('text');
        expect(editor.getValue()).toEqual('text');
      });
    });

    describe('getSelectedText()', () => {
      it('retrieve selected text on markdown', () => {
        editor.changeMode('markdown');
        editor.setValue('selected text');

        editor.mdEditor.cm.setSelection({
          line: 0,
          ch: 9
        }, {
          line: 0,
          ch: 13
        });

        expect(editor.getSelectedText()).toEqual('text');
      });

      it('retrieve selected text on wysiwyg', () => {
        editor.changeMode('wysiwyg');
        editor.setValue('selected text');

        const wwEditor = editor.wwEditor;
        const selection = wwEditor.editor.getSelection().cloneRange();
        const textElement = wwEditor.get$Body().find('div')[0].firstChild;
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

    it('should sanitize html', () => {
      editor = new Editor({
        el: container,
        height: '300px',
        initialEditType: 'markdown'
      });

      const xss = '<script>alert("xss");</script>';
      editor.setValue(xss);

      const content = editor.preview.getHTML();
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
      editor.setValue(xss);

      const content = editor.getHtml();
      expect(content).toBe(xss);
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

    describe('usageStatistics', () => {
      it('should send request hostname in payload by default', () => {
        spyOn(util, 'sendHostname');

        editor = new Editor({
          el: container
        });

        expect(util.sendHostname).toHaveBeenCalled();
      });

      it('should not send request if the option is set to false', () => {
        spyOn(util, 'sendHostname');

        editor = new Editor({
          el: container,
          usageStatistics: false
        });

        expect(util.sendHostname).not.toHaveBeenCalled();
      });
    });

    describe('toolbaritems', () => {
      it('should populate default toolbar items', () => {
        editor = new Editor({
          el: container
        });

        const toolbarItems = editor.getUI().getToolbar().getItems();
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

        const toolbarItems = editor.getUI().getToolbar().getItems();
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
        const CustomConvertor = class extends Convertor {
        };

        editor = new Editor({
          el: container,
          customConvertor: CustomConvertor
        });
        expect(editor.convertor instanceof Convertor).toBe(true);
        expect(editor.convertor instanceof CustomConvertor).toBe(true);
      });
    });
  });
});
