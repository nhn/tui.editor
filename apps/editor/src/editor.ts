import { EditorOptions } from '@t/editor';
import { DefaultUI, VNode } from '@t/ui';
import EditorCore from './editorCore';
import html from './new/vdom/template';
import { Layout } from './new/components/layout';
import { render } from './new/vdom/renderer';

import '@/css/editor.css';

class Editor extends EditorCore {
  private defaultUI!: DefaultUI;

  constructor(options: EditorOptions) {
    super(options);

    let layoutComp!: Layout;
    const destroy = render(
      this.options.el,
      html`
        <${Layout}
          ref=${(layout: Layout) => (layoutComp = layout)}
          eventEmitter=${this.eventEmitter}
          slots=${this.getEditorElements()}
          hideModeSwitch=${this.options.hideModeSwitch}
          toolbarItems=${this.options.toolbarItems}
          previewStyle=${this.options.previewStyle}
          editorType=${this.options.initialEditType}
        />
      ` as VNode
    );

    this.defaultUI = {
      insertToolbarItem: layoutComp.insertToolbarItem.bind(layoutComp),
      removeToolbarItem: layoutComp.removeToolbarItem.bind(layoutComp),
      destroy,
    };
  }

  getDefaultUI() {
    return this.defaultUI;
  }

  destroy() {
    super.destroy();
    this.defaultUI.destroy();
  }
}

export default Editor;
