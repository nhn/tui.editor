import { PluginContext } from '@toast-ui/editor';
import { isAutoCompleteMode, pluginKey } from '@/utils';
import { TR_ACTIONS } from '@/constants';
import type { Trigger } from '@t/index';

const CODE_SYNTAX = '`';
const CODE_BLOCK_CLASS = 'code-block-line-background';
const CUSTOM_BLOCK_CLASS = 'custom-block-line-background';

export function autoCompleteTrigger(context: PluginContext, triggers: Trigger[]) {
  const rules = triggers.map(
    (trigger) =>
      new context.pmRules.InputRule(trigger.regex, (state, match) => {
        const decorationSet = new context.pmView.DecorationSet();

        if (isAutoCompleteMode(state.selection, decorationSet)) {
          return null;
        }

        const { selection } = state.tr;
        const { depth } = selection.$from;
        const node = selection.$from.node(depth);

        if (
          node.attrs.className?.includes(CODE_BLOCK_CLASS) ||
          node.attrs.className?.includes(CUSTOM_BLOCK_CLASS)
        ) {
          return null;
        }

        if (node.textContent.includes(CODE_SYNTAX)) {
          return null;
        }

        const tr = state.tr.insertText(match[1][match[1].length - 1]);
        const meta = { act: TR_ACTIONS.ADD, trigger: match[1], triggerType: trigger };

        tr.setMeta(pluginKey, meta);
        return tr;
      })
  );

  return context.pmRules.inputRules({ rules });
}
