/**
 * @fileoverview test viewer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import MarkdownIt from 'markdown-it';

import ToastUIEditorViewer from '../../src/js/viewer';
import Convertor from '../../src/js/convertor';
import {CodeBlockManager} from '../../src/js/codeBlockManager';

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

  it('should have codeBlockLanugages option', () => {
    const viewer = new ToastUIEditorViewer();
    expect(viewer.options.codeBlockLanguages.length).toBeTruthy();
  });

  it('should use default convertor if the option value is not set', () => {
    const viewer = new ToastUIEditorViewer();
    expect(viewer.convertor instanceof Convertor).toBe(true);
  });

  it('should use custom convertor if the option value is set', () => {
    const CustomConvertor = class extends Convertor {
    };

    const viewer = new ToastUIEditorViewer({
      customConvertor: CustomConvertor
    });
    expect(viewer.convertor instanceof Convertor).toBe(true);
    expect(viewer.convertor instanceof CustomConvertor).toBe(true);
  });
});
