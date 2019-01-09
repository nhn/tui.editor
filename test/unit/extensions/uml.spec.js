/**
 * @fileoverview test uml extension
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import TuiEditor from '../../../src/js/editor';
import umlExtension from '../../../src/js/extensions/uml';

TuiEditor.defineExtension('uml', umlExtension);

describe('uml extension', () => {
  let editor, wrapper;

  beforeEach(() => {
    wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    jasmine.clock().install();
  });

  afterEach(done => {
    jasmine.clock().uninstall();
    setTimeout(() => {
      wrapper.parentNode.removeChild(wrapper);
      done();
    });
  });

  it('create plant uml image in markdown preview', () => {
    const lang = 'uml';
    editor = new TuiEditor({
      el: wrapper,
      previewStyle: 'vertical',
      height: '100px',
      initialEditType: 'markdown',
      exts: ['uml']
    });

    editor.setValue(`\`\`\`${lang}\nAlice -> Bob: Hello\n\`\`\``);

    jasmine.clock().tick(800);

    expect(editor.preview.$el.get(0).querySelector('pre img').getAttribute('src')).toEqual('http://www.plantuml.com/plantuml/png/Syp9J4vLqBLJSCfFibBmICt9oUS20000');
  });

  it('create plant uml image for code block language plantuml', () => {
    const lang = 'plantuml';
    editor = new TuiEditor({
      el: wrapper,
      previewStyle: 'vertical',
      height: '100px',
      initialEditType: 'markdown',
      exts: ['uml']
    });

    editor.setValue(`\`\`\`${lang}\nAlice -> Bob: Hello\n\`\`\``);

    jasmine.clock().tick(800);

    expect(editor.preview.$el.get(0).querySelector('pre img').getAttribute('src')).toEqual('http://www.plantuml.com/plantuml/png/Syp9J4vLqBLJSCfFibBmICt9oUS20000');
  });

  it('shows code in html in wysiwyg', () => {
    editor = new TuiEditor({
      el: wrapper,
      previewStyle: 'vertical',
      height: '100px',
      initialEditType: 'wysiwyg',
      exts: ['uml']
    });

    editor.setValue(`\`\`\`uml\nAlice -> Bob: Hello\n\`\`\``);

    expect(editor.wwEditor.get$Body().get(0).querySelector('pre').innerHTML).toEqual('Alice -&gt; Bob: Hello');
  });
});
