import { Plugin } from 'prosemirror-state';
import forEachArray from 'tui-code-snippet/collection/forEachArray';
import { Context } from '@t/spec';
import { emitImageBlobHook } from '@/helper/image';
import { EditorType } from '@t/editor';

export function dropImage({ eventEmitter }: Context, editorType: EditorType) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        drop: (_, ev) => {
          const items = (ev as DragEvent).dataTransfer?.files;

          if (items) {
            forEachArray(items, (item) => {
              if (item.type.indexOf('image') !== -1) {
                ev.preventDefault();
                ev.stopPropagation();
                emitImageBlobHook(eventEmitter, editorType, item, ev.type);

                return false;
              }
              return true;
            });
          }
          return true;
        },
      },
    },
  });
}
