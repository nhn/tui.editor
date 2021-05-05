import type { PluginContext } from '@toast-ui/editor';

export function addMergedTableContextMenu({ eventEmitter, i18n }: PluginContext) {
  eventEmitter.listen('contextmenu', (...args) => {
    const [{ menuGroups }] = args;
    const mergedTableContextMenu = [
      {
        label: i18n.get('Merge cells'),
        onClick: () => eventEmitter.emit('command', 'mergeCells'),
        className: 'merge-cells',
      },
      {
        label: i18n.get('Split cells'),
        onClick: () => eventEmitter.emit('command', 'splitCell'),
        className: 'split-cells',
      },
    ];

    menuGroups.splice(2, 0, mergedTableContextMenu);
  });
}
