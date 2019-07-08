/**
* @fileoverview Implements Scroll Sync Extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
import $ from 'jquery';
import Editor from '../editorProxy';
import ScrollManager from './scrollManager';
import SectionManager from './sectionManager';

/**
 * scrollSync plugin
 * @param {Editor} editor - editor
 * @ignore
 */
function scrollSyncExtension(editor) {
  const className = 'tui-scrollsync';
  const i18n = editor.i18n;
  const TOOL_TIP = {
    active: i18n.get('Auto scroll enabled'),
    inactive: i18n.get('Auto scroll disabled')
  };

  if (editor.isViewer()) {
    return;
  }

  const cm = editor.getCodeMirror();
  const sectionManager = new SectionManager(cm, editor.preview);
  const scrollManager = new ScrollManager(sectionManager, cm, editor.preview.$el);

  let isScrollable = false;
  let isActive = true;
  let button;
  let $divider;

  // UI
  if (editor.getUI().name === 'default') {
    const toolbar = editor.getUI().getToolbar();

    toolbar.addItem('divider');
    toolbar.addItem({
      type: 'button',
      options: {
        className,
        command: 'scrollSyncToggle',
        tooltip: TOOL_TIP.active,
        $el: $(`<button class="active ${className}" type="button"></button>`)
      }
    });
    const items = toolbar.getItems();
    $divider = items[items.length - 2].$el;
    button = items[items.length - 1];

    changeButtonVisiblityStateIfNeed();
    // hide scroll follow button in wysiwyg
    editor.on('changeMode', changeButtonVisiblityStateIfNeed);
    editor.on('changePreviewStyle', changeButtonVisiblityStateIfNeed);

    // Commands
    editor.addCommand('markdown', {
      name: 'scrollSyncToggle',
      exec() {
        isActive = !isActive;
        button._onOut();
        if (isActive) {
          button.$el.addClass('active');
          button.setTooltip(TOOL_TIP.active);
        } else {
          button.$el.removeClass('active');
          button.setTooltip(TOOL_TIP.inactive);
        }
        button._onOver();
      }
    });
  }

  // Events
  cm.on('change', () => {
    isScrollable = false;
    sectionManager.makeSectionList();
  });

  /**
   * change button visiblity state
   */
  function changeButtonVisiblityStateIfNeed() {
    if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
      button.$el.show();
      $divider.show();
    } else {
      button.$el.hide();
      $divider.hide();
    }
  }

  editor.on('previewRenderAfter', () => {
    // Immediately after the 'previewRenderAfter' event has occurred,
    // browser rendering is not yet complete.
    // So the size of elements can not be accurately measured.
    setTimeout(() => {
      sectionManager.sectionMatch();
      if (isActive) {
        scrollManager.syncPreviewScrollTopToMarkdown(true);
      }
      isScrollable = true;
    }, 200);
  });

  editor.eventManager.listen('scroll', event => {
    if (!isActive) {
      return;
    }

    if (isScrollable && editor.preview.isVisible()) {
      if (event.source === 'markdown' && !scrollManager.isMarkdownScrollEventBlocked) {
        scrollManager.syncPreviewScrollTopToMarkdown(false);
      } else if (event.source === 'preview' && !scrollManager.isPreviewScrollEventBlocked) {
        scrollManager.syncMarkdownScrollTopToPreview();
      }
    } else {
      scrollManager.saveScrollInfo();
    }
  });
}

Editor.defineExtension('scrollSync', scrollSyncExtension);

export default scrollSyncExtension;
