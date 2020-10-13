import { oneLineTrim } from 'common-tags';

import WysiwygEditor from '@/wysiwyg/wwEditor';
import EventEmitter from '@/event/eventEmitter';
import CommandManager from '@/commands/commandManager';

describe('wysiwyg commands', () => {
  let container: HTMLElement, wwe: WysiwygEditor, em: EventEmitter, cmd: CommandManager;

  function setTextToEditor(text: string) {
    const { state, dispatch } = wwe.view;
    const { tr, doc } = state;
    const lines = text.split('\n');
    const node = lines.map(lineText =>
      wwe.schema.nodes.paragraph.create(null, wwe.schema.text(lineText))
    );

    dispatch(tr.replaceWith(0, doc.content.size, node));
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    em = new EventEmitter();
    wwe = new WysiwygEditor(container, em);
    cmd = new CommandManager(em, {}, wwe.commands);
  });

  afterEach(() => {
    document.body.removeChild(container);
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

    // @TODO In the current specification, when a command is
    // executed in a block quote element, the element disappears.
    // Discuss specification maintaining.
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
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'bulletList');

      let expected = oneLineTrim`
        <ul>
          <li><p>foo</p></li>
        </ul>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
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
      setTextToEditor('foo');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'orderedList');

      let expected = oneLineTrim`
        <ol>
          <li><p>foo</p></li>
        </ol>
      `;

      expect(wwe.getHTML()).toBe(expected);

      setTextToEditor('foo\nbar\nbaz');

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'orderedList');

      expected = oneLineTrim`
        <ol>
          <li><p>foo</p></li>
          <li><p>bar</p></li>
          <li><p>baz</p></li>
        </ol>
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
        imageUrl: '#'
      });

      expect(wwe.getHTML()).toBe('<p><img src="#"><br></p>');
    });

    it('should add image element with enabled attirbute', () => {
      cmd.exec('wysiwyg', 'addImage', {
        imageUrl: '#',
        altText: 'foo',
        foo: 'test'
      });

      expect(wwe.getHTML()).toBe('<p><img src="#" alt="foo"><br></p>');
    });

    it('should not add image element when not having src or wrong attribute', () => {
      cmd.exec('wysiwyg', 'addImage', {
        altText: 'foo'
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });
  });

  describe('addLink command', () => {
    it('should add link element', () => {
      cmd.exec('wysiwyg', 'addLink', {
        linkUrl: '#',
        linkText: 'foo'
      });

      expect(wwe.getHTML()).toBe('<p><a href="#">foo</a></p>');
    });

    it('should not add link element when no selection and attributes are missing', () => {
      cmd.exec('wysiwyg', 'addLink', {
        linkText: 'foo'
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');

      cmd.exec('wysiwyg', 'addLink', {
        linkUrl: '#'
      });

      expect(wwe.getHTML()).toBe('<p><br></p>');
    });
  });

  describe('toggleLink command', () => {
    beforeEach(() => setTextToEditor('foo'));

    it('should add link element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink', {
        linkUrl: 'linkUrl'
      });

      expect(wwe.getHTML()).toBe('<p><a href="linkUrl">foo</a></p>');
    });

    it('should toggle link element to selection', () => {
      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink', {
        linkUrl: 'linkUrl'
      });

      cmd.exec('wysiwyg', 'selectAll');
      cmd.exec('wysiwyg', 'toggleLink');

      expect(wwe.getHTML()).toBe('<p>foo</p>');
    });
  });
});
