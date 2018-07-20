/**
 * @fileoverview test scroll sync extension
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import TuiEditor from '../../../../src/js/editor';
import '../../../../src/js/extensions/scrollSync/scrollSync';
import ScrollManager from '../../../../src/js/extensions/scrollSync/scrollManager.js';

describe('scrollSync', () => {
  let ned, container;

  beforeEach(() => {
    jasmine.getStyleFixtures().fixturesPath = '/base';
    loadStyleFixtures('node_modules/codemirror/lib/codemirror.css');
    container = document.createElement('div');
    document.body.appendChild(container);

    ned = new TuiEditor({
      el: container,
      previewStyle: 'vertical',
      height: '100px',
      initialEditType: 'markdown',
      exts: ['scrollSync'],
      events: {
        'load': editor => {
          editor.getCodeMirror().setSize(200, 50);
          $('.preview').css('padding', '0');
          $('.preview').css('overflow', 'auto');
        }
      }
    });
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  describe('activate/deactivate', () => {
    beforeEach(() => {
      ned.setValue([
        'paragraph',
        '# header1',
        'paragraph',
        'paragraph',
        '## header2',
        'paragraph'
      ].join('\n'));

      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should call scrollManager\'s syncPreviewScrollTopToMarkdown when activated', () => {
      const codemirror = ned.mdEditor.cm;
      const lastLine = codemirror.lastLine();

      spyOn(ScrollManager.prototype, 'syncPreviewScrollTopToMarkdown');

      codemirror.replaceRange('hello!', {line: lastLine});
      jasmine.clock().tick(1000);

      expect(ScrollManager.prototype.syncPreviewScrollTopToMarkdown).toHaveBeenCalled();
    });

    it('should not call scrollManager\'s syncPreviewScrollTopToMarkdown when deactivated', () => {
      const codemirror = ned.mdEditor.cm;
      const lastLine = codemirror.lastLine();

      spyOn(ScrollManager.prototype, 'syncPreviewScrollTopToMarkdown');

      ned.commandManager.exec('scrollSyncToggle'); // deactivate
      codemirror.replaceRange('hello!', {line: lastLine});
      jasmine.clock().tick(1000);

      expect(ScrollManager.prototype.syncPreviewScrollTopToMarkdown).not.toHaveBeenCalled();
    });
  });
});
