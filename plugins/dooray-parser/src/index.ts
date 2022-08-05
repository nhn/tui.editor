import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import { CustomParserMap } from '@toast-ui/toastmark';
import { CustomBlockMdNode, RegexpForDisable, PluginOptions } from '@t/index';
import type { Keymap } from 'prosemirror-commands';

const disabledParseRegCollection: RegexpForDisable = {
  entity: null,
};

const markdownParsers: CustomParserMap = {
  // @ts-expect-error
  paragraph(node: CustomBlockMdNode, { entering }) {
    const { entity } = disabledParseRegCollection;

    if (!entering && entity) {
      const matches = node.stringContent?.match(entity);

      if (matches) {
        node.disabledEntityParse = true;
      }
    }
  },
};

export function extendedKeymap(context: PluginContext, customKeymap: Keymap) {
  return context.pmKeymap.keymap(customKeymap);
}

export default function doorayParserPlugin(
  context: PluginContext,
  options: Partial<PluginOptions> = {}
): PluginInfo {
  const { reDisabledParsing, customKeymap } = options;

  if (reDisabledParsing) {
    disabledParseRegCollection.entity = reDisabledParsing.entity;
  }

  return {
    markdownParsers,
    markdownPlugins: customKeymap ? [() => extendedKeymap(context, customKeymap)] : [],
    wysiwygPlugins: customKeymap ? [() => extendedKeymap(context, customKeymap)] : [],
  };
}
