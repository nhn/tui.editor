/**
 * @fileoverview Implements table plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import { addLangs } from './langs';

import createMergedTable from './mergedTableCreator';
import prepareTableUnmerge from './tableUnmergePreparer';
import { createToMarkRenderer } from './toMarkRenderer';

import { getWwMergedTableManager } from './wwMergedTableManager';
import { getWwMergedTableSelectionManager } from './wwMergedTableSelectionManager';

import { getWwAddRowCommand } from './mergedTableAddRow';
import { getWwAddColumnCommand } from './mergedTableAddCol';
import { getWwRemoveRowCommand } from './mergedTableRemoveRow';
import { getWwRemoveColumnCommand } from './mergedTableRemoveCol';
import { getWwAlignColumnCommand } from './mergedTableAlignCol';

import { getMergeCellCommand } from './mergeCell';
import { getUnmergeCellCommand } from './unmergeCell';

import { updateContextMenu } from './mergedTableUI';

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
  const wwMergeCell = getMergeCellCommand(editor);
  const wwUnergeCell = getUnmergeCellCommand(editor);

  editor.addCommand(wwMergeCell);
  editor.addCommand(wwUnergeCell);
}

/**
 * Change wysiwyg component managers
 * @param {object} wwComponentManager - componentMananger instance
 * @param {Editor} editor - editor instance
 * @private
 */
function _changeWysiwygManagers(wwComponentManager, editor) {
  wwComponentManager.removeManager('table');
  wwComponentManager.removeManager('tableSelection');

  const WwMergedTableManager = getWwMergedTableManager(editor);
  const WwMergedTableSelectionManager = getWwMergedTableSelectionManager(editor);

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
 * @param {Editor} editor - editor instance
 * @private
 */
function _snatchWysiwygCommand(commandWrapper, editor) {
  const { command } = commandWrapper;

  if (!command.isWWType()) {
    return;
  }

  switch (command.getName()) {
    case 'AddRow':
      commandWrapper.command = getWwAddRowCommand(editor);
      break;
    case 'AddCol':
      commandWrapper.command = getWwAddColumnCommand(editor);
      break;
    case 'RemoveRow':
      commandWrapper.command = getWwRemoveRowCommand(editor);
      break;
    case 'RemoveCol':
      commandWrapper.command = getWwRemoveColumnCommand(editor);
      break;
    case 'AlignCol':
      commandWrapper.command = getWwAlignColumnCommand(editor);
      break;
    default:
  }
}

/**
 * Bind events.
 * @param {object} eventManager - eventManager instance
 * @parma {Editor} editor - editor instance
 * @private
 */
function _bindEvents(eventManager, editor) {
  eventManager.listen('convertorAfterMarkdownToHtmlConverted', html =>
    _changeHtml(html, createMergedTable)
  );
  eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html =>
    _changeHtml(html, prepareTableUnmerge)
  );
  eventManager.listen('addCommandBefore', commandWrapper => {
    _snatchWysiwygCommand(commandWrapper, editor);
  });
}

/**
 * Plant table plugin
 * @param {Editor} editor - editor instance
 */
export default function tablePlugin(editor) {
  const { eventManager } = editor;

  addLangs(editor);

  _bindEvents(eventManager, editor);

  if (editor.isViewer()) {
    return;
  }

  const wwComponentManager = editor.wwEditor.componentManager;
  const popupTableUtils = editor.getUI().getPopupTableUtils();

  _addCommands(editor);
  _changeWysiwygManagers(wwComponentManager, editor);

  editor.toMarkOptions = getExtendedToMarkOptions(editor.toMarkOptions);

  if (popupTableUtils) {
    updateContextMenu(
      popupTableUtils,
      eventManager,
      wwComponentManager.getManager('tableSelection'),
      editor
    );
  }
}
