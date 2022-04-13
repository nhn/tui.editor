import { PluginContext } from '@toast-ui/editor';
import { isAutoCompleteMode, getActions, pluginKey, closeAutoComplete } from '@/utils';
import {
  PluginOptions,
  AutoCompleteState,
  ActivateAutoCompleteState,
  DeactivateAutoCompleteState,
  AutoCompleteAction,
  OpenAutoComplete,
} from '@t/index';
import { USER_ACTIONS, TR_ACTIONS } from '@/constants';
import type { Plugin } from 'prosemirror-state';

export function autoComplete(context: PluginContext, reducer: Required<PluginOptions>['reducer']) {
  const deactivateAutoCompleteState: DeactivateAutoCompleteState = {
    active: false,
    decorations: context.pmView.DecorationSet.empty,
  };

  const plugin: Plugin<AutoCompleteState> = new context.pmState.Plugin({
    key: pluginKey,
    view() {
      return {
        update: (view, prevState) => {
          const prev = pluginKey.getState(prevState) as ActivateAutoCompleteState;
          const next = pluginKey.getState(view.state) as ActivateAutoCompleteState;

          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed = next.active && !started && !stopped && prev.filter !== next.filter;

          const action: Omit<AutoCompleteAction, 'act'> = {
            view,
            trigger: next.trigger ?? prev.trigger,
            filter: next.filter ?? prev.filter,
            range: next.range ?? prev.range,
            triggerType: next.triggerType ?? prev.triggerType,
          };

          if (started) {
            reducer({ ...action, act: USER_ACTIONS.OPEN });
          }

          if (changed) {
            reducer({ ...action, act: USER_ACTIONS.FILTER });
          }

          if (stopped) {
            reducer({ ...action, act: USER_ACTIONS.CLOSE });
          }
        },
      };
    },
    state: {
      init() {
        return deactivateAutoCompleteState;
      },
      apply(tr, state): AutoCompleteState {
        const meta = tr.getMeta(pluginKey) as OpenAutoComplete;

        if (meta?.act === TR_ACTIONS.ADD) {
          const { trigger, filter, triggerType } = meta;
          const from = tr.selection.from - trigger.length - (filter?.length ?? 0);
          const to = tr.selection.from;
          const attrs = { ...triggerType?.decorationAttrs, class: 'dooray-auto-complete' };
          const deco = context.pmView.Decoration.inline(from, to, attrs, {
            inclusiveStart: false,
            inclusiveEnd: true,
          });

          return {
            active: true,
            trigger: meta.trigger,
            decorations: context.pmView.DecorationSet.create(tr.doc, [deco]),
            filter: filter ?? '',
            range: { from, to },
            triggerType,
          };
        }

        const { decorations } = state;
        const nextDecorations = decorations.map(tr.mapping, tr.doc);
        const hasDecoration = nextDecorations.find().length > 0;

        if (
          meta?.act === TR_ACTIONS.REMOVE ||
          !isAutoCompleteMode(tr.selection, nextDecorations) ||
          !hasDecoration
        ) {
          return deactivateAutoCompleteState;
        }

        const { active, trigger, triggerType } = state;
        const [nextDecoration] = nextDecorations.find();
        const { from, to } = nextDecoration;
        const text = tr.doc.textBetween(from, to);

        if (!text.startsWith(trigger)) {
          return deactivateAutoCompleteState;
        }

        return {
          active,
          trigger,
          decorations: nextDecorations,
          filter: text.slice(trigger.length),
          range: { from, to },
          triggerType,
        };
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorations;
      },
      handleKeyDown(view, ev) {
        const { trigger, active, decorations, triggerType } = this.getState(
          view.state
        ) as ActivateAutoCompleteState;

        if (!active || !isAutoCompleteMode(view.state.selection, decorations)) {
          return false;
        }

        const [deco] = decorations.find();
        const { from, to } = deco;

        const text = view.state.doc.textBetween(from, to);

        const filter = text.slice(trigger?.length ?? 1);

        const isCancelWithSpace = triggerType?.cancelWithSpace ?? true;

        if (isCancelWithSpace && filter.length === 0 && (ev.key === ' ' || ev.key === 'Spacebar')) {
          closeAutoComplete(view);
          view.dispatch(view.state.tr.insertText(' '));
          return true;
        }

        if (filter.length === 0 && ev.key === 'Backspace') {
          context.pmState.undoInputRule(view.state, view.dispatch);
          closeAutoComplete(view);
          return true;
        }

        const userAction = getActions(ev);
        const currentAction: Omit<AutoCompleteAction, 'act'> = {
          view,
          trigger,
          filter,
          range: { from, to },
          triggerType,
        };

        switch (userAction) {
          case USER_ACTIONS.CLOSE:
            return closeAutoComplete(view);
          case USER_ACTIONS.ENTER:
            return (
              reducer({ ...currentAction, act: USER_ACTIONS.ENTER }) || closeAutoComplete(view)
            );
          case USER_ACTIONS.UP:
          case USER_ACTIONS.DOWN:
            return reducer({ ...currentAction, act: userAction });
          default:
            break;
        }
        return false;
      },
    },
  });

  return plugin;
}
