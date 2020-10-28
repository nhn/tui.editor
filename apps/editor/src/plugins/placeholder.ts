import { Plugin } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';

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

          placeHolder.classList.add('placeholder');

          if (options.className) {
            placeHolder.classList.add(options.className);
          }
          placeHolder.textContent = options.text;

          return DecorationSet.create(doc, [Decoration.widget(1, placeHolder)]);
        }
        return null;
      }
    }
  });
}
