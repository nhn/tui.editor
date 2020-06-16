import Editor from '@toast-ui/editor';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

const editor2 = new Editor({
  el: document.getElementById('editor'),
  height: '200px',
  minHeight: '100px',
  toolbarItems: ['test', 'test2', 'test3'],
  useCommandShortcut: true
});

editor2.changeMode('wysiwyg', true);

const editor: Editor = new Editor({
  el: document.querySelector('#el'),
  initialValue: '# HELLO TOAST UI EDITOR!'
});

Editor.codeBlockManager;
Editor.codeBlockManager.createCodeBlockHtml('en_US', 'Hello World');
Editor.codeBlockManager.getReplacer('youtube');
const cm = new toastui.CommandManager(editor);
const tuiCommand = toastui.Command;
tuiCommand.TYPE.GB;
tuiCommand.TYPE.MD;
tuiCommand.TYPE.WW;
const cmd = new tuiCommand('enter', 13);
const tuiCmdManagerCmd = toastui.CommandManager.command('shift', { name: 'shift' });
const command = cm.addCommand(cmd);
command.getName();
command.getType();
command.isGlobalType();
command.isMDType();
command.isWWType();

Editor.isViewer;
const wwe = editor.getCurrentModeEditor() as toastui.WysiwygEditorOptions;

const node = new Node();
Editor.WwCodeBlockManager.convertNodesToText([node]);
Editor.factory({ el: document.querySelector('#editorSection') });
Editor.getInstances().length == 1;

editor.addHook('click', () => {
  console.log('click Handler!');
});
const selection = new Range();
editor.addWidget(selection, document.querySelector('#editorSection'), 'bottom', 20);
editor.afterAddedCommand();
editor.blur();
editor.changeMode('markdown', false);
editor.changePreviewStyle('tab');
editor.exec('delete');
editor.focus();
editor.getCodeMirror();
editor.getCurrentModeEditor();
editor.getCurrentPreviewStyle();
editor.getHtml();
editor.getMarkdown();
editor.getRange();
editor.getSelectedText();
editor.getSquire();
editor.getTextObject(selection);
editor.getUI();
editor.height('300px');
editor.hide();
editor.insertText('TYPE CHECKING!');
editor.isMarkdownMode();
editor.isViewer();
editor.isWysiwygMode();
editor.minHeight('150px');
editor.moveCursorToEnd();
editor.moveCursorToStart();
editor.off('click');
editor.on('click', (e, test) => console.log(e.target, test));
editor.remove();
editor.removeHook('click');
editor.reset();
editor.scrollTop(0);
editor.setHtml('<div>HELLO</div>');
editor.setMarkdown('### Delicious Web!', true);
editor.setUI(editor.getUI());
editor.show();

Editor.setLanguage('en', {
  Markdown: 'Markdown',
  WYSIWYG: 'WYSIWYG',
  Write: 'Write',
  Preview: 'Preview',
  Headings: 'Headings',
  Paragraph: 'Paragraph',
  Bold: 'Bold',
  Italic: 'Italic',
  Strike: 'Strike',
  Code: 'Inline code',
  Line: 'Line',
  Blockquote: 'Blockquote',
  'Unordered list': 'Unordered list',
  'Ordered list': 'Ordered list',
  Task: 'Task',
  Indent: 'Indent',
  Outdent: 'Outdent',
  'Insert link': 'Insert link',
  'Insert CodeBlock': 'Insert codeBlock',
  'Insert table': 'Insert table',
  'Insert image': 'Insert image',
  Heading: 'Heading',
  'Image URL': 'Image URL',
  'Select image file': 'Select image file',
  Description: 'Description',
  OK: 'OK',
  More: 'More',
  Cancel: 'Cancel',
  File: 'File',
  URL: 'URL',
  'Link text': 'Link text',
  'Add row': 'Add row',
  'Add col': 'Add col',
  'Remove row': 'Remove row',
  'Remove col': 'Remove col',
  'Align left': 'Align left',
  'Align center': 'Align center',
  'Align right': 'Align right',
  'Remove table': 'Remove table',
  'Would you like to paste as table?': 'Would you like to paste as table?',
  'Text color': 'Text color',
  'Auto scroll enabled': 'Auto scroll enabled',
  'Auto scroll disabled': 'Auto scroll disabled',
  'Choose language': 'Choose language'
});

const viewer: Viewer = new Viewer({
  el: document.querySelector('#el')
});

Viewer.codeBlockManager;
Viewer.isViewer;

viewer.addHook('click', () => {
  return 1;
});
viewer.isMarkdownMode();
viewer.isViewer();
viewer.isWysiwygMode();
viewer.off('click');
viewer.on('click', e => {
  return 1;
});
viewer.remove();
viewer.setMarkdown('### I am Viewer!');
Editor.getInstances().length == 1;
