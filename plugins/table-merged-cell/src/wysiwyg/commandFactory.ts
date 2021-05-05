import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory } from '@t/index';
import { createMergeCellsCommand } from './command/mergeCells';
import { createSplitCellCommand } from './command/splitCell';

export function createCommands(context: PluginContext, OffsetMap: TableOffsetMapFactory) {
  return {
    mergeCells: createMergeCellsCommand(context, OffsetMap),
    splitCell: createSplitCellCommand(context, OffsetMap),
  };
}
