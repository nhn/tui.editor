import i18n from '../i18n/i18n';

export class ToolbarItemFactory {
  /* eslint-disable complexity */
  static create(name) {
    let toolbarItem;

    switch (name) {
      case 'heading':
        toolbarItem = {
          name: 'heading',
          className: 'tui-heading',
          event: 'openHeadingSelect',
          tooltip: i18n.get('Headings'),
          state: 'heading'
        };
        break;
      case 'bold':
        toolbarItem = {
          name: 'bold',
          className: 'tui-bold',
          command: 'bold',
          tooltip: i18n.get('Bold'),
          state: 'strong'
        };
        break;
      case 'italic':
        toolbarItem = {
          name: 'italic',
          className: 'tui-italic',
          command: 'italic',
          tooltip: i18n.get('Italic'),
          state: 'emph'
        };
        break;
      case 'strike':
        toolbarItem = {
          name: 'strike',
          className: 'tui-strike',
          command: 'strike',
          tooltip: i18n.get('Strike'),
          state: 'strike'
        };
        break;
      case 'hr':
        toolbarItem = {
          name: 'hr',
          className: 'tui-hrline',
          command: 'hr',
          tooltip: i18n.get('Line'),
          state: 'thematicBreak'
        };
        break;
      case 'quote':
        toolbarItem = {
          name: 'quote',
          className: 'tui-quote',
          command: 'blockQuote',
          tooltip: i18n.get('Blockquote'),
          state: 'blockQuote'
        };
        break;
      case 'ul':
        toolbarItem = {
          name: 'ul',
          className: 'tui-ul',
          command: 'bulletList',
          tooltip: i18n.get('Unordered list'),
          state: 'list'
        };
        break;
      case 'ol':
        toolbarItem = {
          name: 'ol',
          className: 'tui-ol',
          command: 'orderedList',
          tooltip: i18n.get('Ordered list'),
          state: 'orderedList'
        };
        break;
      case 'task':
        toolbarItem = {
          name: 'task',
          className: 'tui-task',
          command: 'taskList',
          tooltip: i18n.get('Task'),
          state: 'taskList'
        };
        break;
      case 'table':
        toolbarItem = {
          name: 'table',
          className: 'tui-table',
          event: 'openPopupAddTable',
          tooltip: i18n.get('Insert table'),
          state: 'table'
        };
        break;
      case 'image':
        toolbarItem = {
          name: 'image',
          className: 'tui-image',
          event: 'openPopupAddImage',
          tooltip: i18n.get('Insert image'),
          state: ''
        };
        break;
      case 'link':
        toolbarItem = {
          name: 'link',
          className: 'tui-link',
          event: 'openPopupAddLink',
          tooltip: i18n.get('Insert link')
        };
        break;
      case 'code':
        toolbarItem = {
          name: 'code',
          className: 'tui-code',
          command: 'code',
          tooltip: i18n.get('Code'),
          state: 'code'
        };
        break;
      case 'codeblock':
        toolbarItem = {
          name: 'codeblock',
          className: 'tui-codeblock',
          command: 'codeBlock',
          tooltip: i18n.get('Insert CodeBlock'),
          state: 'codeBlock'
        };
        break;
      case 'indent':
        toolbarItem = {
          name: 'indent',
          className: 'tui-indent',
          command: 'indent',
          tooltip: i18n.get('Indent')
        };
        break;
      case 'outdent':
        toolbarItem = {
          name: 'outdent',
          className: 'tui-outdent',
          command: 'outdent',
          tooltip: i18n.get('Outdent')
        };
        break;
      default:
      //
    }

    return toolbarItem;
  }
  /* eslint-enable complexity */
}
