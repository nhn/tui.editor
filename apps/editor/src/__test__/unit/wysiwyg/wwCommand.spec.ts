import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import { cls } from '@/utils/dom';

import type { HTMLConvertorMap } from '@toast-ui/toastmark';

const CODE_BLOCK_CLS = cls('ww-code-block');

describe('wysiwyg commands', () => {
  let wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  function setTextToEditor(text: string) {
    const { state, dispatch } = wwe.view;
    const { tr, doc } = state;
    const lines = text.split('\n');
    const node = lines.map((lineText) =>
      wwe.schema.nodes.paragraph.create(null, wwe.schema.text(lineText))
    );

    dispatch(tr.replaceWith(0, doc.content.size, node));
  }

  function setContent(content: string) {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = content;

    const nodes = DOMParser.fromSchema(wwe.schema).parse(wrapper);

    wwe.setModel(nodes);
  }

  beforeEach(() => {
    const customHTMLRenderer: HTMLConvertorMap = {
      myCustom(node) {
        const span = document.createElement('span');

        span.innerHTML = node.literal!;

        return [
          { type: 'openTag', tagName: 'div', attributes: { 'data-custom': 'myCustom' } },
          { type: 'html', content: span.outerHTML },
          { type: 'closeTag', tagName: 'div' },
        ];
      },
    };
    const toDOMAdaptor = new WwToDOMAdaptor({}, customHTMLRenderer);

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, { toDOMAdaptor });
    cmd = new CommandManager(em, {}, wwe.commands, () => 'wysiwyg');
  });

  afterEach(() => {
    wwe.destroy();
  });

  describe('heading command', () => {
    it('should add empty heading element', () => {
      cmd.exec('heading', { level: 1 });

      expect(wwe.getHTML()).toBe('<h1><br></h1>');
    });

    it('should add heading element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 2 });

      expect(wwe.getHTML()).toBe('<h2>foo</h2>');
    });

    it('should change heading element by level', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 3 });

      expect(wwe.getHTML()).toBe('<h3>foo</h3>');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 4 });

      expect(wwe.getHTML()).toBe('<h4>foo</h4>');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 5 });

      expect(wwe.getHTML()).toBe('<h5>foo</h5>');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 6 });

      expect(wwe.getHTML()).toBe('<h6>foo</h6>');
    });

    it('should change heading element to paragraph with level 0', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('heading', { level: 0 });

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('hr command', () => {
    it('should add hr element with empty paragraphs in empty document', () => {
      cmd.exec('hr');

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <p><br></p>
        <div><hr></div>
        <p><br></p>
      `);
    });

    it('should add hr element with after empty paragraph', () => {
      setTextToEditor('foo');
      wwe.setSelection(2, 2);
      cmd.exec('hr');

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <p>foo</p>
        <div><hr></div>
        <p><br></p>
      `);
    });

    it('should add only hr element', () => {
      setTextToEditor('foo\nbar');
      wwe.setSelection(2, 2);
      cmd.exec('hr');

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <p>foo</p>
        <div><hr></div>
        <p>bar</p>
      `);
    });

    it('should not add hr element when there is selection', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('hr');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('blockQuote command', () => {
    it('should add blockquote element including empty paragraph', () => {
      cmd.exec('blockQuote');

      expect(wwe.getHTML()).toBe('<blockquote><p><br></p></blockquote>');
    });

    it('should change blockquote element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('blockQuote');

      expect(wwe.getHTML()).toBe('<blockquote><p>foo</p></blockquote>');
    });

    it('should wrap with blockquote element', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('blockQuote');
      cmd.exec('blockQuote');

      const expected = oneLineTrim`
        <blockquote>
          <blockquote><p>foo</p></blockquote>
        </blockquote>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('codeBlock command', () => {
    it('should add pre element including code element', () => {
      cmd.exec('codeBlock');

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <div data-language="text" class="${CODE_BLOCK_CLS}">
          <pre>
            <code><br></code>
          </pre>
        </div>
      `);
    });

    it('should change pre element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('codeBlock');

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <div data-language="text" class="${CODE_BLOCK_CLS}">
          <pre>
            <code>foo</code>
          </pre>
        </div>
      `);
    });
  });

  describe('bulletList command', () => {
    it('should add ul element having empty list item', () => {
      cmd.exec('bulletList');

      const expected = oneLineTrim`
        <ul>
          <li><p><br></p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to bullet list item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('selectAll');
      cmd.exec('bulletList');

      const expected = oneLineTrim`
        <ul>
          <li><p>foo</p></li>
          <li><p>bar</p></li>
          <li><p>baz</p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('orderedList command', () => {
    it('should add ol element having empty list item', () => {
      cmd.exec('orderedList');

      const expected = oneLineTrim`
        <ol>
          <li><p><br></p></li>
        </ol>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to ordered list item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('selectAll');
      cmd.exec('orderedList');

      const expected = oneLineTrim`
        <ol>
          <li><p>foo</p></li>
          <li><p>bar</p></li>
          <li><p>baz</p></li>
        </ol>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  it('bulletList and orderedList command should change parent list to other list when in list item', () => {
    setTextToEditor('foo\nbar\nbaz');

    cmd.exec('selectAll');
    cmd.exec('bulletList');

    wwe.setSelection(3, 3); // in 'foo'
    cmd.exec('orderedList');

    let expected = oneLineTrim`
      <ol>
        <li><p>foo</p></li>
        <li><p>bar</p></li>
        <li><p>baz</p></li>
      </ol>
    `;

    expect(wwe.getHTML()).toBe(expected);

    wwe.setSelection(11, 11); // in 'bar'
    cmd.exec('bulletList');

    expected = oneLineTrim`
      <ul>
        <li><p>foo</p></li>
        <li><p>bar</p></li>
        <li><p>baz</p></li>
      </ul>
    `;

    expect(wwe.getHTML()).toBe(expected);
  });

  describe('taskList command', () => {
    it('should add task to ul element ', () => {
      cmd.exec('taskList');

      const expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true">
            <p><br></p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to task item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('selectAll');
      cmd.exec('taskList');

      const expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true">
            <p>foo</p>
          </li>
          <li class="task-list-item" data-task="true">
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true">
            <p>baz</p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should toggle task list item', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('selectAll');
      cmd.exec('taskList');

      wwe.setSelection(3, 3); // from 'foo'
      cmd.exec('bulletList');

      let expected = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
          </li>
          <li class="task-list-item" data-task="true">
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true">
            <p>baz</p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);

      wwe.setSelection(3, 12); // from 'foo' to 'bar'
      cmd.exec('taskList');

      expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true">
            <p>foo</p>
          </li>
          <li>
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true">
            <p>baz</p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('bold command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add strong element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('bold');

      expect(wwe.getHTML()).toBe('<p><strong>foo</strong></p>');
    });

    it('should toggle and remove strong element', () => {
      cmd.exec('selectAll');
      cmd.exec('bold');

      cmd.exec('selectAll');
      cmd.exec('bold');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('italic command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add emphasis element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('italic');

      expect(wwe.getHTML()).toBe('<p><em>foo</em></p>');
    });

    it('should toggle and remove emphasis element', () => {
      cmd.exec('selectAll');
      cmd.exec('bold');

      cmd.exec('selectAll');
      cmd.exec('bold');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('strike command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add del element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('strike');

      expect(wwe.getHTML()).toBe('<p><del>foo</del></p>');
    });

    it('should toggle and remove del element', () => {
      cmd.exec('selectAll');
      cmd.exec('strike');

      cmd.exec('selectAll');
      cmd.exec('strike');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('code command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add code element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('code');

      expect(wwe.getHTML()).toBe('<p><code>foo</code></p>');
    });

    it('should toggle and remove code element', () => {
      cmd.exec('selectAll');
      cmd.exec('code');

      cmd.exec('selectAll');
      cmd.exec('code');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('addImage command', () => {
    it('should add image element', () => {
      cmd.exec('addImage', {
        imageUrl: '#',
      });

      expect(wwe.getHTML()).toBe('<p><img src="#"><br></p>');
    });

    it('should add image element with enabled attirbute', () => {
      cmd.exec('addImage', {
        imageUrl: '#',
        altText: 'foo',
        foo: 'test',
      });

      expect(wwe.getHTML()).toBe('<p><img src="#" alt="foo"><br></p>');
    });

    it('should not add image element when not having imageUrl attribute', () => {
      cmd.exec('addImage', {
        altText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should not decode url which is already encoded', () => {
      cmd.exec('addImage', {
        imageUrl: 'https://firebasestorage.googleapis.com/images%2Fimage.png?alt=media',
        altText: 'foo',
      });

      expect(wwe.getHTML()).toBe(
        '<p><img src="https://firebasestorage.googleapis.com/images%2Fimage.png?alt=media" alt="foo"><br></p>'
      );
    });
  });

  describe('addLink command', () => {
    it('should add link element', () => {
      cmd.exec('addLink', {
        linkUrl: '#',
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><a href="#">foo</a></p>');
    });

    it('should not add link element when no selection and attributes are missing', () => {
      cmd.exec('addLink', {
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');

      cmd.exec('addLink', {
        linkUrl: '#',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should change link url in selection', () => {
      cmd.exec('addLink', {
        linkUrl: '#',
        linkText: 'foo bar baz',
      });

      wwe.setSelection(5, 8);

      cmd.exec('addLink', {
        linkUrl: 'http://test.com',
        linkText: 'bar',
      });

      const expected = oneLineTrim`
        <p>
          <a href="#">foo </a>
          <a href="http://test.com">bar</a>
          <a href="#"> baz</a>
        </p>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should not decode url which is already encoded', () => {
      cmd.exec('addLink', {
        linkUrl: 'https://firebasestorage.googleapis.com/links%2Fimage.png?alt=media',
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe(
        '<p><a href="https://firebasestorage.googleapis.com/links%2Fimage.png?alt=media">foo</a></p>'
      );
    });
  });

  describe(`addLink command with 'linkAttributes' option`, () => {
    beforeEach(() => {
      const linkAttributes = {
        target: '_blank',
        rel: 'noopener noreferrer',
      };
      const toDOMAdaptor = new WwToDOMAdaptor({}, {});

      em = new EventEmitter();
      wwe = new WysiwygEditor(em, { toDOMAdaptor, linkAttributes });
      cmd = new CommandManager(em, {}, wwe.commands, () => 'wysiwyg');
    });

    it('should add link element with link attributes', () => {
      cmd.exec('addLink', {
        linkUrl: '#',
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe(
        '<p><a href="#" target="_blank" rel="noopener noreferrer">foo</a></p>'
      );
    });
  });

  describe('toggleLink command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add link element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('toggleLink', {
        linkUrl: 'linkUrl',
      });

      expect(wwe.getHTML()).toBe('<p><a href="linkUrl">foo</a></p>');
    });

    it('should toggle link element to selection', () => {
      cmd.exec('selectAll');
      cmd.exec('toggleLink', {
        linkUrl: 'linkUrl',
      });

      cmd.exec('selectAll');
      cmd.exec('toggleLink');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('history command', () => {
    beforeEach(() => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('bold');
      cmd.exec('italic');
    });

    it('undo go back to before previous action', () => {
      cmd.exec('undo');
      expect(wwe.getHTML()).toBe('<p><strong>foo</strong></p>');

      cmd.exec('undo');
      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });

    it('redo cancel undo action', () => {
      cmd.exec('undo');
      cmd.exec('undo');
      cmd.exec('redo');

      expect(wwe.getHTML()).toBe('<p><strong>foo</strong></p>');
    });
  });

  describe('indent command', () => {
    let html;

    beforeEach(() => {
      html = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
            <ol>
              <li><p>bar</p></li>
              <li><p>baz</p></li>
              <li><p>qux</p></li>
            </ol>
          </li>
        </ul>
      `;

      setContent(html);
    });

    // @TODO move to 'tab' key event test
    // it('should add spaces for tab when it is not in list', () => {
    //   setContent('<p>foo</p>');

    //   wwe.setSelection(1, 1);
    //   cmd.exec( 'indent');

    //   expect(wwe.getHTML()).toBe('<p>    foo</p>');

    //   wwe.setSelection(1, 8);
    //   cmd.exec( 'indent');

    //   expect(wwe.getHTML()).toBe('<p>    </p>');
    // });

    it('should indent to list items at cursor position', () => {
      wwe.setSelection(18, 18);
      cmd.exec('indent');

      const expected = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
            <ol>
              <li>
                <p>bar</p>
                <ol>
                  <li><p>baz</p></li>
                </ol>
              </li>
              <li><p>qux</p></li>
            </ol>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should indent to list items as selection', () => {
      wwe.setSelection(18, 26);
      cmd.exec('indent');

      const expected = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
            <ol>
              <li>
                <p>bar</p>
                <ol>
                  <li><p>baz</p></li>
                  <li><p>qux</p></li>
                </ol>
              </li>
            </ol>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('outdent command', () => {
    let html;

    beforeEach(() => {
      html = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
            <ol>
              <li>
                <p>bar</p>
                <ul>
                  <li><p>baz</p></li>
                </ul>
              </li>
            </ol>
          </li>
        </ul>
      `;

      setContent(html);
    });

    // @TODO move to 'shift + tab' key event test
    // it('should remove spaces for tab when it is not in list', () => {
    //   setContent('<p> &nbsp; &nbsp;foo</p>');

    //   wwe.setSelection(4, 4);
    //   cmd.exec( 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foo</p>');

    //   setContent('<p>foo &nbsp; &nbsp;bar</p>');

    //   wwe.setSelection(6, 6);
    //   cmd.exec( 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foo &nbsp;bar</p>');

    //   wwe.setSelection(6, 8);
    //   cmd.exec( 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foobar</p>');
    // });

    it('should outdent to list items at cursor position', () => {
      wwe.setSelection(19, 19);
      cmd.exec('outdent');

      const expected = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
            <ol>
              <li><p>bar</p></li>
              <li><p>baz</p></li>
            </ol>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should outdent to list items as selection', () => {
      wwe.setSelection(10, 20);
      cmd.exec('outdent');

      const expected = oneLineTrim`
        <ul>
          <li><p>foo</p></li>
          <li>
            <p>bar</p>
            <ul>
              <li><p>baz</p></li>
            </ul>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change list item of 1 depth into paragraph ', () => {
      wwe.setSelection(3, 5);
      cmd.exec('outdent');

      const expected = oneLineTrim`
        <p>foo</p>
        <ol>
          <li>
            <p>bar</p>
            <ul>
              <li><p>baz</p></li>
            </ul>
          </li>
        </ol>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });
  });

  describe('customBlock command', () => {
    it('should add customBlock element', () => {
      cmd.exec('customBlock', { info: 'myCustom' });

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <div class="toastui-editor-custom-block">
          <div class="toastui-editor-custom-block-editor" style="display: none;"></div>
          <div class="toastui-editor-custom-block-view">
            <div data-custom="myCustom">
              <span></span>
            </div>
            <div class="tool">
              <span class="info">myCustom</span>
              <button type="button"></button>
            </div>
          </div>
        </div>
      `);
    });

    it('should change customBlock element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('selectAll');
      cmd.exec('customBlock', { info: 'myCustom' });

      expect(wwe.getHTML()).toBe(oneLineTrim`
        <div class="toastui-editor-custom-block">
          <div class="toastui-editor-custom-block-editor" style="display: none;"></div>
          <div class="toastui-editor-custom-block-view">
            <div data-custom="myCustom">
              <span>foo</span>
            </div>
            <div class="tool">
              <span class="info">myCustom</span>
              <button type="button"></button>
            </div>
          </div>
        </div>
      `);
    });
  });
});
