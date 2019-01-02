import {Selector, t} from 'testcafe';

class Toolbar {
  constructor() {
    const toolbar = Selector('.tui-editor-defaultUI > .te-toolbar-section');

    this.heading = toolbar.find('.tui-heading');
    this.bold = toolbar.find('.tui-bold');
    this.italic = toolbar.find('.tui-italic');
    this.color = toolbar.find('.tui-color');
    this.strike = toolbar.find('.tui-strike');
    this.hrline = toolbar.find('.tui-hrline');
    this.quote = toolbar.find('.tui-quote');
    this.ul = toolbar.find('.tui-ul');
    this.ol = toolbar.find('.tui-ol');
    this.task = toolbar.find('.tui-task');
    this.indent = toolbar.find('.tui-indent');
    this.outdent = toolbar.find('.tui-outdent');
    this.table = toolbar.find('.tui-table');
    this.image = toolbar.find('.tui-image');
    this.link = toolbar.find('.tui-link');
    this.code = toolbar.find('.tui-code');
    this.codeblock = toolbar.find('.tui-codeblock');
    this.scrollsync = toolbar.find('.tui-scrollsync');
  }
}

class Tabbar {
  constructor() {
    const tabbar = Selector('.tui-editor-defaultUI > .te-mode-switch-section');

    this.markdown = tabbar.find('.markdown');
    this.wysiwyg = tabbar.find('.wysiwyg');
  }
}

class Popup {
  constructor() {
    const link = Selector('.te-popup-add-link');

    this.linkText = link.find('.te-link-text-input');
    this.linkURL = link.find('.te-url-input');
    this.linkConfirm = link.find('.te-ok-button');
    this.linkCancel = link.find('.te-close-button');

    const color = Selector('.tui-popup-color');
    this.colorConfirm = color.find('.te-apply-button');
  }
}

class Markdown {
  constructor() {
    const editor = Selector('.te-md-container .te-editor');

    this.preview = Selector('.te-md-container .te-preview .tui-editor-contents div');
    this.lines = editor.find('.CodeMirror-line');

    this._addCustomDOMProperties();
  }

  _addCustomDOMProperties() {
    this.preview = this.preview.addCustomDOMProperties({
      innerHTML: el => el.innerHTML
    });
  }
}

class Wysiwyg {
  constructor() {
    const editor = Selector('.te-ww-container .te-editor');
    const contentArea = editor.find('.tui-editor-contents');

    this.blocks = contentArea.find('div,h1,h2,h3,h4,h5,h6,ul,ol,hr,table,pre');
  }
}

class Editor {
  ZWS = String.fromCharCode(0x200b);

  toolbar = new Toolbar();

  tabbar = new Tabbar();

  markdown = new Markdown();

  wysiwyg = new Wysiwyg();

  popup = new Popup();

  constructor() {
    this.tooltip = Selector('.tui-tooltip');
    this.tooltipText = this.tooltip.find('.text');
  }

  async showWysiwyg() {
    await t.click(this.tabbar.wysiwyg);
    await this.fixWysiwygCaret();
  }

  async fixWysiwygCaret() {
    await t.click(this.toolbar.code)
      .click(this.toolbar.code);
  }

  async showMarkdown() {
    await t.click(this.tabbar.markdown);
  }
}

export default new Editor();
