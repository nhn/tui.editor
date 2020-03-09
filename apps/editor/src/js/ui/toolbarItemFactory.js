/**
 * @fileoverview Implements Toolbar Item Factory
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

import ToolbarItem from './toolbarItem';
import ToolbarButton from './toolbarButton';
import ToolbarDivider from './toolbarDivider';
import i18n from '../i18n';

/**
 * Toolbar Item Factory
 * @ignore
 */
class ToolbarItemFactory {
  /**
   * create toolbar item instance
   * @param {string} name - toolbar item name
   * @param {object} [options] - options to the constructor
   * @return {ToolbarItem} - created toolbar item instance
   * @static
   */
  /* eslint-disable complexity */
  static create(name, options) {
    let toolbarItem;

    switch (name) {
      case 'heading':
        toolbarItem = new ToolbarButton({
          name: 'heading',
          className: 'tui-heading',
          event: 'openHeadingSelect',
          tooltip: i18n.get('Headings'),
          state: 'heading'
        });
        break;
      case 'bold':
        toolbarItem = new ToolbarButton({
          name: 'bold',
          className: 'tui-bold',
          command: 'Bold',
          tooltip: i18n.get('Bold'),
          state: 'strong'
        });
        break;
      case 'italic':
        toolbarItem = new ToolbarButton({
          name: 'italic',
          className: 'tui-italic',
          command: 'Italic',
          tooltip: i18n.get('Italic'),
          state: 'emph'
        });
        break;
      case 'strike':
        toolbarItem = new ToolbarButton({
          name: 'strike',
          className: 'tui-strike',
          command: 'Strike',
          tooltip: i18n.get('Strike'),
          state: 'strike'
        });
        break;
      case 'hr':
        toolbarItem = new ToolbarButton({
          name: 'hr',
          className: 'tui-hrline',
          command: 'HR',
          tooltip: i18n.get('Line'),
          state: 'thematicBreak'
        });
        break;
      case 'quote':
        toolbarItem = new ToolbarButton({
          name: 'quote',
          className: 'tui-quote',
          command: 'Blockquote',
          tooltip: i18n.get('Blockquote'),
          state: 'blockQuote'
        });
        break;
      case 'ul':
        toolbarItem = new ToolbarButton({
          name: 'ul',
          className: 'tui-ul',
          command: 'UL',
          tooltip: i18n.get('Unordered list'),
          state: 'list'
        });
        break;
      case 'ol':
        toolbarItem = new ToolbarButton({
          name: 'ol',
          className: 'tui-ol',
          command: 'OL',
          tooltip: i18n.get('Ordered list'),
          state: 'orderedList'
        });
        break;
      case 'task':
        toolbarItem = new ToolbarButton({
          name: 'task',
          className: 'tui-task',
          command: 'Task',
          tooltip: i18n.get('Task'),
          state: 'taskList'
        });
        break;
      case 'table':
        toolbarItem = new ToolbarButton({
          name: 'table',
          className: 'tui-table',
          event: 'openPopupAddTable',
          tooltip: i18n.get('Insert table'),
          state: 'table'
        });
        break;
      case 'image':
        toolbarItem = new ToolbarButton({
          name: 'image',
          className: 'tui-image',
          event: 'openPopupAddImage',
          tooltip: i18n.get('Insert image'),
          state: ''
        });
        break;
      case 'link':
        toolbarItem = new ToolbarButton({
          name: 'link',
          className: 'tui-link',
          event: 'openPopupAddLink',
          tooltip: i18n.get('Insert link')
        });
        break;
      case 'code':
        toolbarItem = new ToolbarButton({
          name: 'code',
          className: 'tui-code',
          command: 'Code',
          tooltip: i18n.get('Code'),
          state: 'code'
        });
        break;
      case 'codeblock':
        toolbarItem = new ToolbarButton({
          name: 'codeblock',
          className: 'tui-codeblock',
          command: 'CodeBlock',
          tooltip: i18n.get('Insert CodeBlock'),
          state: 'codeBlock'
        });
        break;
      case 'indent':
        toolbarItem = new ToolbarButton({
          name: 'indent',
          className: 'tui-indent',
          command: 'Indent',
          tooltip: i18n.get('Indent')
        });
        break;
      case 'outdent':
        toolbarItem = new ToolbarButton({
          name: 'outdent',
          className: 'tui-outdent',
          command: 'Outdent',
          tooltip: i18n.get('Outdent')
        });
        break;
      case 'divider':
        toolbarItem = new ToolbarDivider();
        break;
      case 'button':
        toolbarItem = new ToolbarButton(options);
        break;
      case 'item':
      default:
        toolbarItem = new ToolbarItem(options);
    }

    return toolbarItem;
  }
  /* eslint-enable complexity */
}

export default ToolbarItemFactory;
