/**
 * @fileoverview test viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';
import MarkdownIt from 'markdown-it';

import ToastUIEditorViewer from '@/viewer';
import Convertor from '@/convertor';
import { CodeBlockManager } from '@/codeBlockManager';

describe('Viewer', () => {
  it('markdownitHighlight should be MarkdownIt instance', () => {
    expect(ToastUIEditorViewer.markdownitHighlight instanceof MarkdownIt).toBe(true);
  });

  it("domUtils should have it' functions", () => {
    expect(typeof ToastUIEditorViewer.domUtils.getNodeName).toBe('function');
  });

  it('codeBlockManager should be CodeBlockManager instance', () => {
    expect(ToastUIEditorViewer.codeBlockManager instanceof CodeBlockManager).toBe(true);
  });

  describe('should sanitize html', () => {
    let viewer;

    beforeEach(() => {
      viewer = new ToastUIEditorViewer({
        el: $('<div>')[0]
      });
    });

    it('xss', () => {
      const xss = '<script>alert("xss");</script>';

      viewer.setValue(xss);
      const content = viewer.preview.getHTML();

      expect(content).toBe('');
    });

    it('details, summary', () => {
      const html = '<details><summary>foo</summary></details>';

      viewer.setValue(html);
      const content = viewer.preview.getHTML();

      expect(content).toBe('');
    });
  });

  describe('should not sanitize html if useDefaultHTMLSanitizer is false', () => {
    let viewer;

    beforeEach(() => {
      viewer = new ToastUIEditorViewer({
        el: $('<div>')[0],
        useDefaultHTMLSanitizer: false
      });
    });

    it('xss', () => {
      const xss = '<script>alert("xss");</script>';

      viewer.setValue(xss);
      const content = viewer.preview.getHTML();

      expect(content).toBe(xss);
    });

    it('details, summary', () => {
      const html = '<details><summary>foo</summary></details>';

      viewer.setValue(html);
      const content = viewer.preview.getHTML();

      expect(content).toBe(html);
    });
  });

  it('should have codeBlockLanugages option', () => {
    const [el] = $('<div>');
    const viewer = new ToastUIEditorViewer({ el });

    expect(viewer.options.codeBlockLanguages.length).toBeTruthy();
  });

  it('should use default convertor if the option value is not set', () => {
    const [el] = $('<div>');
    const viewer = new ToastUIEditorViewer({ el });

    expect(viewer.convertor instanceof Convertor).toBe(true);
  });

  it('should use custom convertor if the option value is set', () => {
    const CustomConvertor = class extends Convertor {};

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

  describe('plugins option', () => {
    let container, viewer;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(done => {
      setTimeout(() => {
        viewer.remove();
        container.parentNode.removeChild(container);
        done();
      });
    });

    it('should invoke plugin functions', () => {
      const fooPlugin = jasmine.createSpy('fooPlugin');
      const barPlugin = jasmine.createSpy('barPlugin');

      viewer = new ToastUIEditorViewer({
        el: container,
        plugins: [fooPlugin, barPlugin]
      });

      expect(fooPlugin).toHaveBeenCalledWith(viewer);
      expect(barPlugin).toHaveBeenCalledWith(viewer);
    });

    it('should invoke plugin function with options of plugin', () => {
      const plugin = jasmine.createSpy(plugin);
      const options = {};

      viewer = new ToastUIEditorViewer({
        el: container,
        plugins: [[plugin, options]]
      });

      expect(plugin).toHaveBeenCalledWith(viewer, options);
    });
  });
});
