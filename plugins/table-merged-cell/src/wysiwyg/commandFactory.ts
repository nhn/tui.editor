import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory } from '@t/index';
import { createMergeCellsCommand } from './command/mergeCells';
import { createSplitCellsCommand } from './command/splitCells';
import { createRemoveColumnCommand } from './command/removeColumn';
import { createRemoveRowCommand } from './command/removeRow';
import { createAddRowCommand } from './command/addRow';
import { createAddColumnCommand } from './command/addColumn';
import { Direction } from './command/direction';

export function createCommands(context: PluginContext, OffsetMap: TableOffsetMapFactory) {
  return {
    mergeCells: createMergeCellsCommand(context, OffsetMap),
    splitCells: createSplitCellsCommand(context, OffsetMap),
    addRowToUp: createAddRowCommand(context, OffsetMap, Direction.UP),
    addRowToDown: createAddRowCommand(context, OffsetMap, Direction.DOWN),
    removeRow: createRemoveRowCommand(context, OffsetMap),
    addColumnToLeft: createAddColumnCommand(context, OffsetMap, Direction.LEFT),
    addColumnToRight: createAddColumnCommand(context, OffsetMap, Direction.RIGHT),
    removeColumn: createRemoveColumnCommand(context, OffsetMap),
  };
}
