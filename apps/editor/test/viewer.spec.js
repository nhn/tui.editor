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
});
