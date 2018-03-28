/**
 * @fileoverview Implements toolbar
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import i18n from '../i18n';
import Toolbar from './toolbar';
import ToolbarDivider from './toolbarDivider';
import Button from './button';

class DefaultToolbar extends Toolbar {
  /**
   * Creates an instance of Toolbar.
   * @param {EventManager} eventManager - event manager
   * @memberof DefaultToolbar
   */
  constructor(eventManager) {
    super(eventManager);

    this._initItems();
  }

  _initItems() {
    const items = [
      new Button({
        name: 'heading',
        className: 'tui-heading',
        event: 'openHeadingSelect',
        tooltip: i18n.get('Headings')
      }),
      new Button({
        name: 'bold',
        className: 'tui-bold',
        command: 'Bold',
        tooltip: i18n.get('Bold'),
        state: 'bold'
      }),
      new Button({
        name: 'italic',
        className: 'tui-italic',
        command: 'Italic',
        tooltip: i18n.get('Italic'),
        state: 'italic'
      }),
      new Button({
        name: 'strike',
        className: 'tui-strike',
        command: 'Strike',
        tooltip: i18n.get('Strike'),
        state: 'strike'
      }),
      new ToolbarDivider(),
      new Button({
        name: 'hr',
        className: 'tui-hrline',
        command: 'HR',
        tooltip: i18n.get('Line')
      }),
      new Button({
        name: 'quote',
        className: 'tui-quote',
        command: 'Blockquote',
        tooltip: i18n.get('Blockquote'),
        state: 'quote'
      }),
      new Button({
        name: 'ul',
        className: 'tui-ul',
        command: 'UL',
        tooltip: i18n.get('Unordered list')
      }),
      new Button({
        name: 'ol',
        className: 'tui-ol',
        command: 'OL',
        tooltip: i18n.get('Ordered list')
      }),
      new Button({
        name: 'task',
        className: 'tui-task',
        command: 'Task',
        tooltip: i18n.get('Task')
      }),
      new ToolbarDivider(),
      new Button({
        name: 'table',
        className: 'tui-table',
        event: 'openPopupAddTable',
        tooltip: i18n.get('Insert table')
      }),
      new Button({
        name: 'image',
        className: 'tui-image',
        event: 'openPopupAddImage',
        tooltip: i18n.get('Insert image')
      }),
      new Button({
        name: 'link',
        className: 'tui-link',
        event: 'openPopupAddLink',
        tooltip: i18n.get('Insert link')
      }),
      new ToolbarDivider(),
      new Button({
        name: 'code',
        className: 'tui-code',
        command: 'Code',
        tooltip: i18n.get('Code'),
        state: 'code'
      }),
      new Button({
        name: 'codeblock',
        className: 'tui-codeblock',
        command: 'CodeBlock',
        tooltip: i18n.get('Insert CodeBlock'),
        state: 'codeBlock'
      })
    ];

    this.setItems(items);
  }
}

export default DefaultToolbar;
