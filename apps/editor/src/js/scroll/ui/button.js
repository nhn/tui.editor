import css from 'tui-code-snippet/domUtil/css';

const className = 'tui-scrollsync';
const activeClassName = 'tui-scrollsync active';
let active = true;

export function isActive() {
  return active;
}

export function createButton(editor) {
  if (editor.isViewer() || editor.getUI().name !== 'default') {
    return;
  }

  const { i18n } = editor;
  const tooltip = {
    ACTIVE: i18n.get('Auto scroll enabled'),
    INACTIVE: i18n.get('Auto scroll disabled')
  };
  const toolbar = editor.getUI().getToolbar();
  const buttonEl = document.createElement('button');

  buttonEl.className = activeClassName;

  toolbar.addItem('divider');
  toolbar.addItem({
    type: 'button',
    options: {
      command: 'scrollSyncToggle',
      tooltip: tooltip.ACTIVE,
      el: buttonEl
    }
  });
  const items = toolbar.getItems();
  const divider = items[items.length - 2].el;
  const button = items[items.length - 1];

  changeButtonVisiblityStateIfNeed(editor, button, divider);
  addEventListener(editor, button, divider);
  addEditorCommand(editor, button, tooltip);
}

function addEventListener(editor, button, divider) {
  // hide scroll follow button in wysiwyg
  editor.on('changeMode', () => changeButtonVisiblityStateIfNeed(editor, button, divider));
  editor.on('changePreviewStyle', () => changeButtonVisiblityStateIfNeed(editor, button, divider));
}

function addEditorCommand(editor, button, tooltip) {
  // Commands
  editor.addCommand('markdown', {
    name: 'scrollSyncToggle',
    exec() {
      active = !active;
      button._onOut();
      if (active) {
        button.el.className = activeClassName;
        button.setTooltip(tooltip.ACTIVE);
      } else {
        button.el.className = className;
        button.setTooltip(tooltip.INACTIVE);
      }
      button._onOver();
    }
  });
}

function changeButtonVisiblityStateIfNeed(editor, button, divider) {
  if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
    css(button.el, { display: 'inline-block' });
    css(divider, { display: 'inline-block' });
  } else {
    css(button.el, { display: 'none' });
    css(divider, { display: 'none' });
  }
}
