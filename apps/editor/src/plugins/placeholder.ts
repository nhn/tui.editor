import { Plugin } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import addClass from 'tui-code-snippet/domUtil/addClass';

interface Options {
  text?: string;
  className?: string;
}

export function placeholder(options: Options) {
  return new Plugin({
    props: {
      decorations(state) {
        const { doc } = state;

        if (
          options.text &&
          doc.childCount === 1 &&
          doc.firstChild!.isTextblock &&
          doc.firstChild!.content.size === 0
        ) {
          const placeHolder = document.createElement('span');

          addClass(placeHolder, 'placeholder');

          if (options.className) {
            addClass(placeHolder, options.className);
          }
          placeHolder.textContent = options.text;

          return DecorationSet.create(doc, [Decoration.widget(1, placeHolder)]);
        }
        return null;
      },
    },
  });
}
