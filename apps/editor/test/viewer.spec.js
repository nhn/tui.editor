/**
 * @fileoverview test viewer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import MarkdownIt from 'markdown-it';

import ToastUIEditorViewer from '../src/js/viewer';
import {CodeBlockManager} from '../src/js/codeBlockManager';

describe('Viewer', () => {
  it('markdownitHighlight should be MarkdownIt instance', () => {
    expect(ToastUIEditorViewer.markdownitHighlight instanceof MarkdownIt).toBe(true);
  });

  it('domUtils should have it\' functions', () => {
    expect(typeof ToastUIEditorViewer.domUtils.getNodeName).toBe('function');
  });

  it('codeBlockManager should be CodeBlockManager instance', () => {
    expect(ToastUIEditorViewer.codeBlockManager instanceof CodeBlockManager).toBe(true);
  });

  it('should sanitize html', () => {
    const viewer = new ToastUIEditorViewer();
    const xss = '<script>alert("xss");</script>';
    viewer.setValue(xss);
    const content = viewer.preview.getHTML();
    expect(content).toBe('');
  });

  it('should not sanitize html if useDefaultHTMLSanitizer is false', () => {
    const xssViewer = new ToastUIEditorViewer({
      useDefaultHTMLSanitizer: false
    });
    const xss = '<script>alert("xss");</script>';
    xssViewer.setValue(xss);
    const content = xssViewer.preview.getHTML();
    expect(content).toBe(xss);
  });
});
