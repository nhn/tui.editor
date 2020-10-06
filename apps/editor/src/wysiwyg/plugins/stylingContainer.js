import { Plugin } from 'prosemirror-state';

const CONTENTS_CLASS_NAME = 'tui-editor-contents';

export function stylingContainer() {
  return new Plugin({
    props: {
      attributes: { class: CONTENTS_CLASS_NAME }
    }
  });
}
