import { oneLineTrim } from 'common-tags';

import { DOMParser } from 'prosemirror-model';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';

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
    const adaptor = new WwToDOMAdaptor({}, {});

    em = new EventEmitter();
    wwe = new WysiwygEditor(em, adaptor);
    cmd = new CommandManager(em, {}, wwe.commands);
  });

  afterEach(() => {
    wwe.destroy();
  });

  describe('heading command', () => {
    it('should add empty heading element', () => {
      cmd.exec('wysiwyg', 'heading', { level: 1 });

      expect(wwe.getHTML()).toBe('<h1><br></h1>');
    });

    it('should add heading element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'heading', { level: 2 });

      expect(wwe.getHTML()).toBe('<h2>foo</h2>');
    });

    it('should change heading element by level', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'heading', { level: 3 });

      expect(wwe.getHTML()).toBe('<h3>foo</h3>');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'heading', { level: 4 });

      expect(wwe.getHTML()).toBe('<h4>foo</h4>');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'heading', { level: 5 });

      expect(wwe.getHTML()).toBe('<h5>foo</h5>');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'heading', { level: 6 });

      expect(wwe.getHTML()).toBe('<h6>foo</h6>');
    });
  });

  describe('hr command', () => {
    it('should add hr element with wrapping div element', () => {
      cmd.exec('wysiwyg', 'hr');

      expect(wwe.getHTML()).toBe('<div><hr></div>');
    });

    it('should change hr element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'hr');

      expect(wwe.getHTML()).toBe('<div><hr></div>');
    });
  });

  describe('blockQuote command', () => {
    it('should add blockquote element including empty paragraph', () => {
      cmd.exec('wysiwyg', 'blockQuote');

      expect(wwe.getHTML()).toBe('<blockquote><p><br></p></blockquote>');
    });

    it('should change blockquote element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'blockQuote');

      expect(wwe.getHTML()).toBe('<blockquote><p>foo</p></blockquote>');
    });

    it('should wrap with blockquote element', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'blockQuote');
      cmd.exec('wysiwyg', 'blockQuote');

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
      cmd.exec('wysiwyg', 'codeBlock');

      expect(wwe.getHTML()).toBe('<pre><code><br></code></pre>');
    });

    it('should change pre element to selection', () => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'codeBlock');

      expect(wwe.getHTML()).toBe('<pre><code>foo</code></pre>');
    });
  });

  describe('bulletList command', () => {
    it('should add ul element having empty list item', () => {
      cmd.exec('wysiwyg', 'bulletList');

      const expected = oneLineTrim`
        <ul>
          <li><p><br></p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to bullet list item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bulletList');

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
      cmd.exec('wysiwyg', 'orderedList');

      const expected = oneLineTrim`
        <ol>
          <li><p><br></p></li>
        </ol>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to ordered list item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'orderedList');

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

    cmd.exec('wysiwyg', 'selectAll');
    cmd.exec('wysiwyg', 'bulletList');

    wwe.setSelection(3, 3); // in 'foo'
    cmd.exec('wysiwyg', 'orderedList');

    let expected = oneLineTrim`
      <ol>
        <li><p>foo</p></li>
        <li><p>bar</p></li>
        <li><p>baz</p></li>
      </ol>
    `;

    expect(wwe.getHTML()).toBe(expected);

    wwe.setSelection(11, 11); // in 'bar'
    cmd.exec('wysiwyg', 'bulletList');

    expected = oneLineTrim`
      <ul>
        <li><p>foo</p></li>
        <li><p>bar</p></li>
        <li><p>baz</p></li>
      </ul>
    `;

    expect(wwe.getHTML()).toBe(expected);
  });

  describe('task command', () => {
    it('should add task to ul element ', () => {
      cmd.exec('wysiwyg', 'task');

      const expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p><br></p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should change to task item in selection', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'task');

      const expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>foo</p>
          </li>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>baz</p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);
    });

    it('should toggle task list item', () => {
      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'task');

      wwe.setSelection(3, 3); // from 'foo'
      cmd.exec('wysiwyg', 'bulletList');

      let expected = oneLineTrim`
        <ul>
          <li>
            <p>foo</p>
          </li>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>baz</p>
          </li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);

      wwe.setSelection(3, 12); // from 'foo' to 'bar'
      cmd.exec('wysiwyg', 'task');

      expected = oneLineTrim`
        <ul>
          <li class="task-list-item" data-task="true" data-task-checked="false">
            <p>foo</p>
          </li>
          <li>
            <p>bar</p>
          </li>
          <li class="task-list-item" data-task="true" data-task-checked="false">
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
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');

      expect(wwe.getHTML()).toBe('<p><strong>foo</strong></p>');
    });

    it('should toggle and remove strong element', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('italic command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add emphasis element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'italic');

      expect(wwe.getHTML()).toBe('<p><em>foo</em></p>');
    });

    it('should toggle and remove emphasis element', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('strike command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add del element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'strike');

      expect(wwe.getHTML()).toBe('<p><del>foo</del></p>');
    });

    it('should toggle and remove del element', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'strike');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'strike');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('code command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add code element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'code');

      expect(wwe.getHTML()).toBe('<p><code>foo</code></p>');
    });

    it('should toggle and remove code element', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'code');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'code');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('addImage command', () => {
    it('should add image element', () => {
      cmd.exec('wysiwyg', 'addImage', {
        imageUrl: '#',
      });

      expect(wwe.getHTML()).toBe('<p><img src="#"><br></p>');
    });

    it('should add image element with enabled attirbute', () => {
      cmd.exec('wysiwyg', 'addImage', {
        imageUrl: '#',
        altText: 'foo',
        foo: 'test',
      });

      expect(wwe.getHTML()).toBe('<p><img src="#" alt="foo"><br></p>');
    });

    it('should not add image element when not having imageUrl attribute', () => {
      cmd.exec('wysiwyg', 'addImage', {
        altText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should decode attribute and encode wrong markdown charactors', () => {
      cmd.exec('wysiwyg', 'addImage', {
        imageUrl: 'foo %D1%88%D0%B5%D0%BB%D0%BB%D1%8B ()[]<>',
        altText: 'foo ()[]<>',
      });

      expect(wwe.getHTML()).toBe(
        '<p><img src="foo%20шеллы%20%28%29%5B%5D%3C%3E" alt="foo \\(\\)\\[\\]\\<\\>"><br></p>'
      );
    });
  });

  describe('addLink command', () => {
    it('should add link element', () => {
      cmd.exec('wysiwyg', 'addLink', {
        linkUrl: '#',
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><a href="#">foo</a></p>');
    });

    it('should not add link element when no selection and attributes are missing', () => {
      cmd.exec('wysiwyg', 'addLink', {
        linkText: 'foo',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');

      cmd.exec('wysiwyg', 'addLink', {
        linkUrl: '#',
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });

    it('should decode attribute and encode wrong markdown charactors', () => {
      cmd.exec('wysiwyg', 'addLink', {
        linkUrl: 'foo %D1%88%D0%B5%D0%BB%D0%BB%D1%8B ()[]<>',
        linkText: 'foo ()[]<>',
      });

      expect(wwe.getHTML()).toBe(
        '<p><a href="foo%20шеллы%20%28%29%5B%5D%3C%3E">foo ()[]&lt;&gt;</a></p>'
      );
    });

    describe('', () => {
      beforeEach(() => {
        const linkAttributes = {
          target: '_blank',
          rel: 'noopener noreferrer',
        };
        const adaptor = new WwToDOMAdaptor({}, {});

        em = new EventEmitter();
        wwe = new WysiwygEditor(em, adaptor, linkAttributes);
        cmd = new CommandManager(em, {}, wwe.commands);
      });

      it('should add link element with link attributes', () => {
        cmd.exec('wysiwyg', 'addLink', {
          linkUrl: '#',
          linkText: 'foo',
        });

        expect(wwe.getHTML()).toBe(
          '<p><a href="#" target="_blank" rel="noopener noreferrer">foo</a></p>'
        );
      });
    });
  });

  describe('toggleLink command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add link element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink', {
        linkUrl: 'linkUrl',
      });

      expect(wwe.getHTML()).toBe('<p><a href="linkUrl">foo</a></p>');
    });

    it('should toggle link element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink', {
        linkUrl: 'linkUrl',
      });

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });

  describe('history command', () => {
    beforeEach(() => {
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bold');
      cmd.exec('wysiwyg', 'italic');
    });

    it('undo go back to before previous action', () => {
      cmd.exec('wysiwyg', 'undo');
      expect(wwe.getHTML()).toBe('<p><strong>foo</strong></p>');

      cmd.exec('wysiwyg', 'undo');
      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });

    it('redo cancel undo action', () => {
      cmd.exec('wysiwyg', 'undo');
      cmd.exec('wysiwyg', 'undo');
      cmd.exec('wysiwyg', 'redo');

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
    //   cmd.exec('wysiwyg', 'indent');

    //   expect(wwe.getHTML()).toBe('<p>    foo</p>');

    //   wwe.setSelection(1, 8);
    //   cmd.exec('wysiwyg', 'indent');

    //   expect(wwe.getHTML()).toBe('<p>    </p>');
    // });

    it('should indent to list items at cursor position', () => {
      wwe.setSelection(18, 18);
      cmd.exec('wysiwyg', 'indent');

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
      cmd.exec('wysiwyg', 'indent');

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
    //   cmd.exec('wysiwyg', 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foo</p>');

    //   setContent('<p>foo &nbsp; &nbsp;bar</p>');

    //   wwe.setSelection(6, 6);
    //   cmd.exec('wysiwyg', 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foo &nbsp;bar</p>');

    //   wwe.setSelection(6, 8);
    //   cmd.exec('wysiwyg', 'outdent');

    //   expect(wwe.getHTML()).toBe('<p>foobar</p>');
    // });

    it('should outdent to list items at cursor position', () => {
      wwe.setSelection(19, 19);
      cmd.exec('wysiwyg', 'outdent');

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
      cmd.exec('wysiwyg', 'outdent');

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
      cmd.exec('wysiwyg', 'outdent');

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
});
