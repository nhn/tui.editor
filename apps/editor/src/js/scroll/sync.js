/* eslint-disable no-unused-vars */
import { syncPreviewScrollTopToMarkdown, isBlockedPreviewScrollEvent } from './editorScroll';
import { syncMarkdownScrollTopToPreview, isBlockedMarkdownScrollEvent } from './previewScroll';

let isScrollable = true;

/* eslint-disable no-return-assign */
export function register(editor, preview) {
  addScrollEvent(editor, preview);
  addPreviewRenderedEvent(editor, preview);
  editor.cm.on('change', () => (isScrollable = false));
}

function addPreviewRenderedEvent(editor, preview) {
  editor.eventManager.listen('previewRenderAfter', () => {
    const { cm } = editor;

    // Immediately after the 'previewRenderAfter' event has occurred,
    // browser rendering is not yet complete.
    // So the size of elements can not be accurately measured.
    setTimeout(() => {
      syncPreviewScrollTopToMarkdown(editor, preview, false);

      isScrollable = true;
    }, 200);
  });
}

function addScrollEvent(editor, preview) {
  const { cm, eventManager } = editor;

  eventManager.listen('scroll', ({ source, data }) => {
    if (isScrollable && preview.isVisible()) {
      if (source === 'markdown' && !isBlockedMarkdownScrollEvent()) {
        syncPreviewScrollTopToMarkdown(editor, preview, true);
      } else if (source === 'preview' && !isBlockedPreviewScrollEvent()) {
        syncMarkdownScrollTopToPreview(editor, preview, data);
      }
    }
  });
}
