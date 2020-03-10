/**
 * @fileoverview Implements table plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';

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
  const tempDiv = document.createElement('div');

  tempDiv.innerHTML = html;

  const tables = tempDiv.querySelectorAll('table');

  if (tables.length) {
    toArray(tables).forEach(tableElement => {
      const changedTableElement = onChangeTable(tableElement);

      if (tableElement.hasAttribute('data-tomark-pass')) {
        changedTableElement.setAttribute('data-tomark-pass', '');
      }

      const { parentNode } = tableElement;

      parentNode.appendChild(changedTableElement);
      parentNode.removeChild(tableElement);
    });

    html = tempDiv.innerHTML;
  }

  return html;
}

/**
 * Snatch wysiwyg command.
 * @param {{command: object}} commandWrapper - wysiwyg command wrapper
 * @param {Object.<string, Object>} commandMap - map of command names and command instances
 * @private
 */
function _snatchWysiwygCommand(commandWrapper, commandMap) {
  const { command } = commandWrapper;

  if (!command.isWWType()) {
    return;
  }

  const commandName = command.getName();

  if (commandMap[commandName]) {
    commandWrapper.command = commandMap[commandName];
  }
}

/**
 * Bind events.
 * @param {object} eventManager - eventManager instance
 * @param {Object.<string, Object>} commandMap - map of command names and command instances
 * @private
 */
function _bindEvents(eventManager, commandMap) {
  eventManager.listen('convertorAfterMarkdownToHtmlConverted', html =>
    _changeHtml(html, createMergedTable)
  );
  eventManager.listen('convertorBeforeHtmlToMarkdownConverted', html =>
    _changeHtml(html, prepareTableUnmerge)
  );

  if (commandMap) {
    eventManager.listen('addCommandBefore', commandWrapper => {
      _snatchWysiwygCommand(commandWrapper, commandMap);
    });
  }
}

/**
 * Table merged cell plugin
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
export default function tableMergedCellPlugin(editor) {
  const { eventManager } = editor;
  const isViewer = editor.isViewer();
  const commandMap = isViewer
    ? null
    : {
        AddRow: getWwAddRowCommand(editor),
        AddCol: getWwAddColumnCommand(editor),
        RemoveRow: getWwRemoveRowCommand(editor),
        RemoveCol: getWwRemoveColumnCommand(editor),
        AlignCol: getWwAlignColumnCommand(editor)
      };

  _bindEvents(eventManager, commandMap);

  if (isViewer) {
    return;
  }

  addLangs(editor);

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
