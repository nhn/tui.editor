import Editor from 'tui-editor';
import tuiEditor from 'tui-editor/dist/tui-editor-Editor-all';
import Viewer from 'tui-editor/dist/tui-editor-Viewer';
import tuiViewer from 'tui-editor/dist/tui-editor-Viewer-all';

const editor2 = new tuiEditor({
  el: document.getElementById('editor'),
  height: '200px',
  minHeight: '100px',
  toolbarItems: ['test', 'test2', 'test3'],
  useCommandShortcut: true
});

editor2.changeMode('wysiwyg', true);

const editor:Editor = new Editor({
  el: document.querySelector('#el'),
  initialValue: '# HELLO TOAST UI EDITOR!'
});

new Editor.Button({
  className: 'editor-btn',
  element: $('#container')
});
Editor.codeBlockManager;
Editor.codeBlockManager.createCodeBlockHtml('en_US', 'Hello World');
Editor.codeBlockManager.getReplacer('youtube');
const cm = new Editor.CommandManager();
const command = cm.addCommand(Editor.CommandManager.command('shift'));
command.getName();
command.getType();
command.isGlobalType();
command.isMDType();
command.isWWType();
command.TYPE.GB;
command.TYPE.MD;
command.TYPE.WW;
Editor.domUtils;
Editor.i18n;
Editor.isViewer;
Editor.markdownitHighlight;
new Editor.WwCodeBlockManager();
new Editor.WwTableManager();
new Editor.WwTableSelectionManager();

Editor.defineExtension('youtube', () => { return '<div></div>'});
Editor.factory({el: document.querySelector('#editorSectoin')});
Editor.getInstances().length == 1;

editor.addHook('click', () => { console.log('click Handler!')});
const selection = new Range();
editor.addWidget(selection, document.querySelector('#editorSectoin'), 'bottom', 20);
editor.afterAddedCommand();
editor.blur();
editor.changeMode('markdown', false);
editor.changePreviewStyle('tab');
editor.exec();
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
editor.getValue();
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
editor.setUI({});
editor.setValue('* using TOAST UI');
editor.show();

const viewer:Viewer = new Viewer({
  el: document.querySelector('#el'),
  exts: ['chart', 'youtube']
});

Viewer.codeBlockManager;
Viewer.domUtils;
Viewer.isViewer;
Viewer.markdownitHighlight;

Viewer.defineExtension('youtube', () => {});

viewer.addHook('click', () => { return 1; });
viewer.isMarkdownMode();
viewer.isViewer();
viewer.isWysiwygMode();
viewer.off('click');
viewer.on('click', e => { return 1; });
viewer.remove();
viewer.setMarkdown('### I am Viewer!');
viewer.setValue('### I am setValue method!');
Editor.getInstances().length == 1;

const viewer2 = new tuiViewer({
  el: document.querySelector('#el')
});
viewer2.isViewer();
