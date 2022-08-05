import { PluginContext } from '@toast-ui/editor';
import { isAutoCompleteMode, pluginKey } from '@/utils';
import { TR_ACTIONS } from '@/constants';
import { EditorState, Plugin } from 'prosemirror-state';
import type { AutoCompleteState, Trigger } from '@t/index';
import { DecorationSet } from 'prosemirror-view';

const reBlockClass = /(code-block|custom-block)/;
const reBlankChracters = /^\s*$/;

function isTriggeringAutoComplete(state: EditorState) {
  const { selection } = state.tr;
  const { depth, parentOffset } = selection.$from;
  const node = selection.$from.node(depth);
  const prevCharacter = node.textContent.charAt(parentOffset - 1);
  const plugin = pluginKey.get(state) as Plugin<AutoCompleteState>;
  const decorationSet = plugin.props.decorations?.(state) as DecorationSet;
  // const decorationSet = new context.pmView.DecorationSet();

  return (
    reBlankChracters.test(prevCharacter) &&
    !reBlockClass.test(node.attrs.className) &&
    !plugin.getState(state)?.active &&
    decorationSet &&
    !isAutoCompleteMode(state.selection, decorationSet)
  );
}

export function autoCompleteTrigger(context: PluginContext, triggers: Trigger[]) {
  const rules = triggers.map(
    (trigger) =>
      new context.pmRules.InputRule(trigger.regex, (state, match) => {
        if (isTriggeringAutoComplete(state)) {
          const tr = state.tr.insertText(match[1][match[1].length - 1]);
          const meta = { act: TR_ACTIONS.ADD, trigger: match[1], triggerType: trigger };

          tr.setMeta(pluginKey, meta);
          return tr;
        }

        return null;
      })
  );

  return context.pmRules.inputRules({ rules });
}
