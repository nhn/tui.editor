/**
 * @fileoverview test viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
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
    const el = $('<div>')[0];
    const viewer = new ToastUIEditorViewer({el});
    const xss = '<script>alert("xss");</script>';
    viewer.setValue(xss);
    const content = viewer.preview.getHTML();
    expect(content).toBe('');
  });

  it('should not sanitize html if useDefaultHTMLSanitizer is false', () => {
    const xssViewer = new ToastUIEditorViewer({
      el: $('<div>')[0],
      useDefaultHTMLSanitizer: false
    });
    const xss = '<script>alert("xss");</script>';
    xssViewer.setValue(xss);
    const content = xssViewer.preview.getHTML();
    expect(content).toBe(xss);
  });

  it('should have codeBlockLanugages option', () => {
    const el = $('<div>')[0];
    const viewer = new ToastUIEditorViewer({el});
    expect(viewer.options.codeBlockLanguages.length).toBeTruthy();
  });

  it('should use default convertor if the option value is not set', () => {
    const el = $('<div>')[0];
    const viewer = new ToastUIEditorViewer({el});
    expect(viewer.convertor instanceof Convertor).toBe(true);
  });

  it('should use custom convertor if the option value is set', () => {
    const CustomConvertor = class extends Convertor {
    };

    const viewer = new ToastUIEditorViewer({
      el: $('<div>')[0],
      customConvertor: CustomConvertor
    });
    expect(viewer.convertor instanceof Convertor).toBe(true);
    expect(viewer.convertor instanceof CustomConvertor).toBe(true);
  });

  it('should render initialValue', () => {
    const initialValue = 'Initial **Value**';
    const viewerForInitialValue = new ToastUIEditorViewer({
      el: $(`<div>`)[0],
      initialValue
    });
    const viewerForSetValue = new ToastUIEditorViewer({
      el: $(`<div>`)[0]
    });
    viewerForSetValue.setValue(initialValue);

    expect(viewerForInitialValue.preview.getHTML()).toBe(viewerForSetValue.preview.getHTML());
  });

  it('should use existing html as initial value', () => {
    const html = 'Existing <b>HTML</b>';
    const viewer = new ToastUIEditorViewer({
      el: $(`<div>${html}</div>`)[0]
    });

    expect(viewer.preview.getHTML()).toBe(html);
  });
});
