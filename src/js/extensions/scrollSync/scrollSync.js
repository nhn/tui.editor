/**
* @fileoverview Implements Scroll Sync Extension
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import $ from 'jquery';
import Editor from '../editorProxy';
import ScrollManager from './scrollManager';
import SectionManager from './sectionManager';

const {Button} = Editor;

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
    inActive: i18n.get('Auto scroll disabled')
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
    // init button
    button = new Button({
      className,
      command: 'scrollSyncToggle',
      tooltip: TOOL_TIP.active,
      $el: $(`<button class="active ${className}" type="button"></button>`)
    });

    $divider = editor.getUI().toolbar.addDivider();
    editor.getUI().toolbar.addButton(button);

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
          button.tooltip = TOOL_TIP.active;
        } else {
          button.$el.removeClass('active');
          button.tooltip = TOOL_TIP.inActive;
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
    sectionManager.sectionMatch();
    scrollManager.syncPreviewScrollTopToMarkdown();
    isScrollable = true;
  });

  editor.eventManager.listen('scroll', event => {
    if (!isActive) {
      return;
    }

    if (isScrollable && editor.preview.isVisible()) {
      if (event.source === 'markdown' && !scrollManager.isMarkdownScrollEventBlocked) {
        scrollManager.syncPreviewScrollTopToMarkdown();
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
