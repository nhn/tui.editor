/**
* @fileoverview Implements table extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
import $ from 'jquery';

import Editor from '../editorProxy';
import './langs';
import createMergedTable from './mergedTableCreator';
import prepareTableUnmerge from './tableUnmergePreparer';
import {createToMarkRenderer} from './toMarkRenderer';
import WwMergedTableManager from './wwMergedTableManager';
import WwMergedTableSelectionManager from './wwMergedTableSelectionManager';
import wwAddRow from './mergedTableAddRow';
import wwAddCol from './mergedTableAddCol';
import wwRemoveRow from './mergedTableRemoveRow';
import wwRemoveCol from './mergedTableRemoveCol';
import wwAlignCol from './mergedTableAlignCol';
import wwMergeCell from './mergeCell';
import wwUnergeCell from './unmergeCell';
import mergedTableUI from './mergedTableUI';

/**
 * table extension
 * @param {Editor} editor - editor instance
 * @ignore
 */
function tableExtension(editor) {
  const {eventManager} = editor;

  _bindEvents(eventManager);

  if (editor.isViewer()) {
    return;
  }

  const wwComponentManager = editor.wwEditor.componentManager;
  const popupTableUtils = editor.getUI().getPopupTableUtils();

  _addCommands(editor);
  _changeWysiwygManagers(wwComponentManager);

  editor.toMarkOptions = getExtendedToMarkOptions(editor.toMarkOptions);

  if (popupTableUtils) {
    mergedTableUI.updateContextMenu(popupTableUtils, eventManager, wwComponentManager.getManager('tableSelection'));
  }
}

function getExtendedToMarkOptions(toMarkOptions) {
  const extendedOptions = toMarkOptions || {};
  const baseRenderer = extendedOptions.renderer;

  extendedOptions.renderer = createToMarkRenderer(baseRenderer);

  return extendedOptions;
}

/**
 * Add commands.
 * @param {object} editor - editor instance
 * @private
 */
function _addCommands(editor) {
  editor.addCommand(wwMergeCell);
  editor.addCommand(wwUnergeCell);
}

/**
 * Change wysiwyg component managers.
 * @param {object} wwComponentManager - componentMananger instance
 * @private
 */
function _changeWysiwygManagers(wwComponentManager) {
  wwComponentManager.removeManager('table');
  wwComponentManager.removeManager('tableSelection');

  wwComponentManager.addManager(WwMergedTableManager);
  wwComponentManager.addManager(WwMergedTableSelectionManager);
}

/**
 * Change html by onChangeTable function.
 * @param {string} html - original html
 * @param {function} onChangeTable - function for changing html
 * @returns {string}
 * @private
 */
function _changeHtml(html, onChangeTable) {
  const $tempDiv = $(`<div>${html}</div>`);
  const $tables = $tempDiv.find('table');

  if ($tables.length) {
    $tables.get().forEach(tableElement => {
      const changedTableElement = onChangeTable(tableElement);

      if (tableElement.hasAttribute('data-tomark-pass')) {
        changedTableElement.setAttribute('data-tomark-pass', '');
      }

      $(tableElement).replaceWith(changedTableElement);
    });

    html = $tempDiv.html();
  }

  return html;
}

/**
 * Snatch wysiwyg command.
 * @param {{command: object}} commandWrapper - wysiwyg command wrapper
 * @private
 */
function _snatchWysiwygCommand(commandWrapper) {
  const {command} = commandWrapper;

  if (!command.isWWType()) {
    return;
  }

  switch (command.getName()) {
  case 'AddRow':
    commandWrapper.command = wwAddRow;
    break;
  case 'AddCol':
    commandWrapper.command = wwAddCol;
    break;
  case 'RemoveRow':
    commandWrapper.command = wwRemoveRow;
    break;
  case 'RemoveCol':
    commandWrapper.command = wwRemoveCol;
    break;
  case 'AlignCol':
    commandWrapper.command = wwAlignCol;
    break;
  default:
  }
}

/**
 * Bind events.
 * @param {object} eventManager - eventManager instance
 * @private
 */
function _bindEvents(eventManager) {
  eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => _changeHtml(html, createMergedTable));
  eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html => _changeHtml(html, prepareTableUnmerge));
  eventManager.listen('addCommandBefore', _snatchWysiwygCommand);
}

Editor.defineExtension('table', tableExtension);
