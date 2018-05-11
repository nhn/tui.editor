import { Selector } from 'testcafe';

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

export default new class Editor {
  constructor () {
    this.toolbar = new Toolbar();
    this.markdown = new Markdown();
  }
}();
