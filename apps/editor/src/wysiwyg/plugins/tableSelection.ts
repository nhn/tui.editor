import { Plugin } from 'prosemirror-state';
import { handleMouseDown } from '@/wysiwyg/helper/tableSelection';

export function tableSelectionPlugin() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: handleMouseDown
      }
    }
  });
}
