/**
 * @fileoverview Implements table plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import { addLangs } from './langs';

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
import { renderer } from './renderer';
import { parser } from './parser';

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
function tableMergedCellPlugin(editor) {
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

export default { renderer, parser, pluginFn: tableMergedCellPlugin };
