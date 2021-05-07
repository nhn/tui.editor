import type { PluginContext } from '@toast-ui/editor';
import toArray from 'tui-code-snippet/collection/toArray';

const TABLE_CELL_SELECT_CLASS = '.toastui-editor-cell-selected';

function hasSpanAttr(tableCell: Element) {
  return (
    Number(tableCell.getAttribute('colspan')) > 1 || Number(tableCell.getAttribute('rowspan')) > 1
  );
}

function hasSpanningCell(headOrBody: Element) {
  return toArray(headOrBody.querySelectorAll(TABLE_CELL_SELECT_CLASS)).some(hasSpanAttr);
}

function isCellSelected(headOrBody: Element) {
  return !!headOrBody.querySelectorAll(TABLE_CELL_SELECT_CLASS).length;
}

function createMergedTableContextMenu(context: PluginContext, tableCell: Element) {
  const { i18n, eventEmitter } = context;
  const headOrBody = tableCell.parentElement!.parentElement!;
  const mergedTableContextMenu = [];

  if (isCellSelected(headOrBody)) {
    mergedTableContextMenu.push({
      label: i18n.get('Merge cells'),
      onClick: () => eventEmitter.emit('command', 'mergeCells'),
      className: 'merge-cells',
    });
  }

  if (hasSpanAttr(tableCell) || hasSpanningCell(headOrBody)) {
    mergedTableContextMenu.push({
      label: i18n.get('Split cells'),
      onClick: () => eventEmitter.emit('command', 'splitCells'),
      className: 'split-cells',
    });
  }

  return mergedTableContextMenu;
}

export function addMergedTableContextMenu(context: PluginContext) {
  context.eventEmitter.listen('contextmenu', (...args) => {
    const [{ menuGroups, tableCell }] = args;
    const mergedTableContextMenu = createMergedTableContextMenu(context, tableCell);

    if (mergedTableContextMenu.length) {
      // add merged table context menu on third group
      menuGroups.splice(2, 0, mergedTableContextMenu);
    }
  });
}
