import isArray from 'tui-code-snippet/type/isArray';
import { Plugin, PluginKey, Selection, TextSelection } from 'prosemirror-state';
import { inputRules, InputRule, undoInputRule } from 'prosemirror-inputrules';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Fragment } from 'prosemirror-model';
import i18n from '@/i18n/i18n';
import { deepMergedCopy } from '@/utils/common';

import { EditorPlugin } from '@t/editor';
import { Emitter } from '@t/event';
import { PluginInfoResult } from '@t/plugin';
import { mixinTableOffsetMapPrototype } from '@/wysiwyg/helper/tableOffsetMap';

function execPlugin(plugin: EditorPlugin, eventEmitter: Emitter, usageStatistics: boolean) {
  const pmState = { Plugin, PluginKey, Selection, TextSelection };
  const pmView = { Decoration, DecorationSet };
  const pmModel = { Fragment };
  const pmRules = { InputRule, inputRules, undoInputRule };
  const context = { eventEmitter, usageStatistics, pmState, pmView, pmModel, pmRules, i18n };

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
  eventEmitter.listen('mixinTableOffsetMapPrototype', mixinTableOffsetMapPrototype);

  return (plugins ?? []).reduce<PluginInfoResult>(
    (acc, plugin) => {
      const pluginInfoResult = execPlugin(plugin, eventEmitter, usageStatistics);

      if (!pluginInfoResult) {
        throw new Error('The return value of the executed plugin is empty.');
      }

      const {
        markdownParsers,
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

      if (markdownParsers) {
        acc.markdownParsers = { ...acc.markdownParsers, ...markdownParsers };
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
      markdownParsers: {},
    }
  );
}
