import isArray from 'tui-code-snippet/type/isArray';
import { Plugin, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import i18n from '@/i18n/i18n';
import { deepMergedCopy } from '@/utils/common';

import { EditorPlugin } from '@t/editor';
import { Emitter } from '@t/event';
import { PluginInfoResult } from '@t/plugin';

function execPlugin(plugin: EditorPlugin, eventEmitter: Emitter, usageStatistics: boolean) {
  const pmState = { Plugin, Selection };
  const pmView = { Decoration, DecorationSet };
  const context = { eventEmitter, usageStatistics, pmState, pmView, i18n };

  if (isArray(plugin)) {
    const [pluginFn, options = {}] = plugin;

    return pluginFn(context, options);
  }

  return plugin(context);
}

export function getPluginInfo(
  plugins: EditorPlugin[],
  eventEmitter: Emitter,
  usageStatistics: boolean
) {
  return (plugins ?? []).reduce<PluginInfoResult>(
    (acc, plugin) => {
      const pluginInfoResult = execPlugin(plugin, eventEmitter, usageStatistics);

      if (!pluginInfoResult) {
        throw new Error('The return value of the executed plugin is empty.');
      }

      const {
        toHTMLRenderers,
        toMarkdownRenderers,
        markdownPlugins,
        wysiwygPlugins,
        wysiwygNodeViews,
        markdownCommands,
        wysiwygCommands,
        toolbarItems,
      } = pluginInfoResult;

      if (toHTMLRenderers) {
        acc.toHTMLRenderers = deepMergedCopy(acc.toHTMLRenderers, toHTMLRenderers);
      }

      if (toMarkdownRenderers) {
        acc.toMarkdownRenderers = deepMergedCopy(acc.toMarkdownRenderers, toMarkdownRenderers);
      }

      if (markdownPlugins) {
        acc.mdPlugins = acc.mdPlugins!.concat(markdownPlugins);
      }

      if (wysiwygPlugins) {
        acc.wwPlugins = acc.wwPlugins!.concat(wysiwygPlugins);
      }

      if (wysiwygNodeViews) {
        acc.wwNodeViews = { ...acc.wwNodeViews, ...wysiwygNodeViews };
      }

      if (markdownCommands) {
        acc.mdCommands = { ...acc.mdCommands, ...markdownCommands };
      }

      if (wysiwygCommands) {
        acc.wwCommands = { ...acc.wwCommands, ...wysiwygCommands };
      }

      if (toolbarItems) {
        acc.toolbarItems = acc.toolbarItems!.concat(toolbarItems);
      }

      return acc;
    },
    {
      toHTMLRenderers: {},
      toMarkdownRenderers: {},
      mdPlugins: [],
      wwPlugins: [],
      wwNodeViews: {},
      mdCommands: {},
      wwCommands: {},
      toolbarItems: [],
    }
  );
}
