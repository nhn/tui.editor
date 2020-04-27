/**
 * @fileoverview test viewer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import ToastUIEditorViewer from '@/viewer';
import Convertor from '@/convertor';
import { CodeBlockManager } from '@/codeBlockManager';

describe('Viewer', () => {
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
        el: document.createElement('div')
      });
    });

    it('xss', () => {
      const xss = '<script>alert("xss");</script>';

      viewer.setMarkdown(xss);
      const content = viewer.preview.getHTML();

      expect(content).toBe('\n');
    });

    it('details, summary', () => {
      const html = '<details><summary>foo</summary></details>';

      viewer.setMarkdown(html);
      const content = viewer.preview.getHTML();

      expect(content).toBe('\n');
    });
  });

  describe('should not sanitize html if useDefaultHTMLSanitizer is false', () => {
    let viewer;

    beforeEach(() => {
      viewer = new ToastUIEditorViewer({
        el: document.createElement('div'),
        useDefaultHTMLSanitizer: false
      });
    });

    it('xss', () => {
      const xss = '<script>alert("xss");</script>\n';

      viewer.setMarkdown(xss);
      const content = viewer.preview.getHTML();

      expect(content).toBe(xss);
    });

    it('details, summary', () => {
      const html = '<details><summary>foo</summary></details>\n';

      viewer.setMarkdown(html);
      const content = viewer.preview.getHTML();

      expect(content).toBe(html);
    });
  });

  describe('customHTMLSanitizer option', () => {
    it('should replace default sanitizer with custom sanitizer', () => {
      const customHTMLSanitizer = jasmine.createSpy('sanitizer');
      const viewer = new ToastUIEditorViewer({
        el: document.createElement('div'),
        customHTMLSanitizer
      });
      const content = '<div>custom</div>';

      viewer.setMarkdown(content);

      expect(customHTMLSanitizer).toHaveBeenCalled();
    });
  });

  it('should use default convertor if the option value is not set', () => {
    const el = document.createElement('div');
    const viewer = new ToastUIEditorViewer({ el });

    expect(viewer.convertor instanceof Convertor).toBe(true);
  });

  it('should use custom convertor if the option value is set', () => {
    const CustomConvertor = class extends Convertor {};

    const viewer = new ToastUIEditorViewer({
      el: document.createElement('div'),
      customConvertor: CustomConvertor
    });

    expect(viewer.convertor instanceof Convertor).toBe(true);
    expect(viewer.convertor instanceof CustomConvertor).toBe(true);
  });

  it('should render initialValue', () => {
    const initialValue = 'Initial **Value**';
    const viewerForInitialValue = new ToastUIEditorViewer({
      el: document.createElement('div'),
      initialValue
    });
    const viewerForSetValue = new ToastUIEditorViewer({
      el: document.createElement('div')
    });

    viewerForSetValue.setMarkdown(initialValue);

    expect(viewerForInitialValue.preview.getHTML()).toBe(viewerForSetValue.preview.getHTML());
  });

  it('should use existing html as initial value', () => {
    const el = document.createElement('div');
    const html = 'Existing <b>HTML</b>';

    el.innerHTML = html;
    const viewer = new ToastUIEditorViewer({ el });

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
      const plugin = jasmine.createSpy();
      const options = {};

      viewer = new ToastUIEditorViewer({
        el: container,
        plugins: [[plugin, options]]
      });

      expect(plugin).toHaveBeenCalledWith(viewer, options);
    });
  });
});
