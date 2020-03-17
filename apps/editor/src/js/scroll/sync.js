import { syncPreviewScrollTopToMarkdown, isBlockedPreviewScrollEvent } from './editorScroll';
import { syncMarkdownScrollTopToPreview, isBlockedMarkdownScrollEvent } from './previewScroll';
import { createButton, isActive } from './ui/button';

let isScrollable = true;

/* eslint-disable no-return-assign */
export function register(editor) {
  const { mdEditor, preview } = editor;

  createButton(editor);
  addScrollEvent(mdEditor, preview);
  addPreviewRenderedEvent(mdEditor, preview);
  mdEditor.cm.on('change', () => (isScrollable = false));
}

function addPreviewRenderedEvent(editor, preview) {
  editor.eventManager.listen('previewRenderAfter', () => {
    // Immediately after the 'previewRenderAfter' event has occurred,
    // browser rendering is not yet complete.
    // So the size of elements can not be accurately measured.
    setTimeout(() => {
      if (isActive()) {
        syncPreviewScrollTopToMarkdown(editor, preview);
      }

      isScrollable = true;
    }, 200);
  });
}

function addScrollEvent(editor, preview) {
  const { eventManager } = editor;

  eventManager.listen('scroll', ({ source, data }) => {
    if (!isActive()) {
      return;
    }

    if (isScrollable && preview.isVisible()) {
      if (source === 'markdown' && !isBlockedMarkdownScrollEvent()) {
        syncPreviewScrollTopToMarkdown(editor, preview, true);
      } else if (source === 'preview' && !isBlockedPreviewScrollEvent()) {
        syncMarkdownScrollTopToPreview(editor, preview, data);
      }
    }
  });
}
