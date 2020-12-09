import { oneLineTrim } from 'common-tags';
import { ToDOMAdaptor } from '@t/convertor';
import { CodeBlockMdNode, CustomHTMLRendererMap, HeadingMdNode } from '@t/markdown';
import { WwToDOMAdaptor } from '@/wysiwyg/adaptor/wwToDOMAdaptor';
import EventEmitter from '@/event/eventEmitter';
import WysiwygEditor from '@/wysiwyg/wwEditor';
import { createMdLikeNode } from '@/wysiwyg/adaptor/mdLikeNode';

let container: HTMLElement, wwe: WysiwygEditor, em: EventEmitter, toDOMAdaptor: ToDOMAdaptor;

beforeEach(() => {
  const convertors: CustomHTMLRendererMap = {
    code() {
      return [
        { type: 'openTag', tagName: 'code' },
        { type: 'html', content: '<span>123</span>' },
        { type: 'closeTag', tagName: 'code' }
      ];
    },
    heading(node, { entering }) {
      return {
        type: entering ? 'openTag' : 'closeTag',
        tagName: `h${(node as HeadingMdNode).level}`,
        attributes: { 'data-custom': 'customAttr' },
        classNames: ['custom-heading']
      };
    },
    codeBlock(node) {
      return [
        {
          type: 'openTag',
          tagName: 'pre',
          attributes: { 'data-custom': (node as CodeBlockMdNode).info },
          classNames: ['custom-pre']
        },
        { type: 'openTag', tagName: 'code', classNames: ['custom-code'] },
        { type: 'openTag', tagName: 'span' },
        { type: 'text', content: node.literal! },
        { type: 'closeTag', tagName: 'span' },
        { type: 'closeTag', tagName: 'code' },
        { type: 'closeTag', tagName: 'pre' }
      ];
    },
    emph(_, { entering }) {
      return {
        type: entering ? 'openTag' : 'closeTag',
        tagName: `em`,
        attributes: { 'data-custom': 'customAttr' },
        classNames: ['custom-emph']
      };
    }
  };

  container = document.createElement('div');
  toDOMAdaptor = new WwToDOMAdaptor({}, convertors);
  em = new EventEmitter();
  wwe = new WysiwygEditor(container, em, toDOMAdaptor);
});

describe('mdLikeNode', () => {
  it('heading node should be changed to markdown-like-node', () => {
    const headingNode = createMdLikeNode(
      wwe.schema.nodes.heading.create({ level: 2 }, wwe.schema.text('myHeading'))
    );

    expect(headingNode).toEqual({ type: 'heading', literal: null, isWysiwyg: true, level: 2 });
  });

  it('image node should be changed to markdown-like-node', () => {
    const headingNode = createMdLikeNode(wwe.schema.nodes.image.create({ imageUrl: 'myImageUrl' }));

    expect(headingNode).toEqual({
      type: 'image',
      literal: null,
      isWysiwyg: true,
      destination: 'myImageUrl'
    });
  });

  it('codeBlock node should be changed to markdown-like-node', () => {
    const codeBlockNode = createMdLikeNode(
      wwe.schema.nodes.codeBlock.create({ language: 'myLang' }, wwe.schema.text('myCode'))
    );

    expect(codeBlockNode).toEqual({
      type: 'codeBlock',
      literal: 'myCode',
      isWysiwyg: true,
      info: 'myLang'
    });
  });

  it('bulletList node should be changed to markdown-like-node', () => {
    const bulletListNode = createMdLikeNode(wwe.schema.nodes.bulletList.create());

    expect(bulletListNode).toEqual({
      type: 'list',
      literal: null,
      isWysiwyg: true,
      listData: { type: 'bullet' }
    });
  });

  it('orderedList node should be changed to markdown-like-node', () => {
    const orderedListNode = createMdLikeNode(wwe.schema.nodes.orderedList.create());

    expect(orderedListNode).toEqual({
      type: 'list',
      literal: null,
      isWysiwyg: true,
      listData: { start: 1, type: 'ordered' }
    });
  });

  it('listItem node should be changed to markdown-like-node', () => {
    const listItemNode = createMdLikeNode(wwe.schema.nodes.listItem.create({ task: true }));

    expect(listItemNode).toEqual({
      type: 'item',
      literal: null,
      isWysiwyg: true,
      listData: { task: true, checked: false }
    });
  });

  it('tableHeadCell node should be changed to markdown-like-node', () => {
    const tableHeadCellNode = createMdLikeNode(
      wwe.schema.nodes.tableHeadCell.create({ align: 'left' })
    );

    expect(tableHeadCellNode).toEqual({
      type: 'tableCell',
      cellType: 'head',
      align: 'left',
      literal: null,
      isWysiwyg: true
    });
  });

  it('tableBodyCell node should be changed to markdown-like-node', () => {
    const tableBodyCellNode = createMdLikeNode(
      wwe.schema.nodes.tableBodyCell.create({ align: 'left' })
    );

    expect(tableBodyCellNode).toEqual({
      type: 'tableCell',
      cellType: 'body',
      align: 'left',
      literal: null,
      isWysiwyg: true
    });
  });

  it('customBlock node should be changed to markdown-like-node', () => {
    const customBlockNode = createMdLikeNode(
      wwe.schema.nodes.customBlock.create({ info: 'myCustom' }, wwe.schema.text('myCustom'))
    );

    expect(customBlockNode).toEqual({
      type: 'customBlock',
      info: 'myCustom',
      literal: 'myCustom',
      isWysiwyg: true
    });
  });

  it('link mark should be changed to markdown-like-node', () => {
    const linkNode = createMdLikeNode(
      wwe.schema.marks.link.create({ linkText: 'myLinkText', linkUrl: 'myLinkUrl' })
    );

    expect(linkNode).toEqual({
      type: 'link',
      literal: null,
      isWysiwyg: true,
      title: 'myLinkText',
      destination: 'myLinkUrl'
    });
  });
});

describe('wysiwyg adaptor toDOM using custom renderer', () => {
  it('toDOM should be parsed with renderer tokens for wysiwyg node schema', () => {
    const toDOM = toDOMAdaptor.getToDOM('heading')!;
    const headingNode = wwe.schema.nodes.heading.create({ level: 2 });

    expect(toDOM(headingNode)).toEqual([
      'h2',
      { class: 'custom-heading', 'data-custom': 'customAttr' },
      0
    ]);
  });

  it('toDOM should be parsed with renderer tokens for wysiwyg mark schema', () => {
    const toDOM = toDOMAdaptor.getToDOM('emph')!;
    const emphNode = wwe.schema.marks.emph.create();

    expect(toDOM(emphNode)).toEqual([
      'em',
      { class: 'custom-emph', 'data-custom': 'customAttr' },
      0
    ]);
  });

  it('toDOM should be parsed with the nested renderer tokens', () => {
    const toDOM = toDOMAdaptor.getToDOM('codeBlock')!;
    const codeBlockNode = wwe.schema.nodes.codeBlock.create({ language: 'myLan' });

    expect(toDOM(codeBlockNode)).toEqual([
      'pre',
      { class: 'custom-pre', 'data-custom': 'myLan' },
      ['code', { class: 'custom-code' }, ['span', 0]]
    ]);
  });

  it('html token should be ignored', () => {
    const toDOM = toDOMAdaptor.getToDOM('code')!;
    const codeNode = wwe.schema.marks.code.create();

    expect(toDOM(codeNode)).toEqual(['code', 0]);
  });

  it('should get toDOM for only registered renderer', () => {
    const toDOM = toDOMAdaptor.getToDOM('blockQuote');

    expect(toDOM).toBe(null);
  });
});

describe('wysiwyg adaptor toDOMNode using custom renderer', () => {
  function getHTML(node: Node) {
    return (node as HTMLElement).outerHTML;
  }

  it('toDOMNode should be parsed with renderer tokens for wysiwyg node schema', () => {
    const toDOMNode = toDOMAdaptor.getToDOMNode('heading')!;
    const headingNode = wwe.schema.nodes.heading.create({ level: 2 }, wwe.schema.text('myHeading'));
    const expected = oneLineTrim`
        <h2 class="custom-heading" data-custom="customAttr">
          myHeading
        </h2>
      `;

    expect(getHTML(toDOMNode(headingNode))).toBe(expected);
  });

  it('toDOMNode should be parsed with the nested renderer tokens', () => {
    const toDOMNode = toDOMAdaptor.getToDOMNode('codeBlock')!;
    const codeBlockNode = wwe.schema.nodes.codeBlock.create(
      { language: 'myLan' },
      wwe.schema.text('codeBlock')
    );

    const expected = oneLineTrim`
        <pre class="custom-pre" data-custom="myLan">
          <code class="custom-code">
            <span>codeBlock</span>
          </code>
        </pre>
      `;

    expect(getHTML(toDOMNode(codeBlockNode))).toBe(expected);
  });

  it('html token should be parsed in DOMNode', () => {
    const toDOMNode = toDOMAdaptor.getToDOMNode('code')!;
    const codeNode = wwe.schema.marks.code.create();

    const expected = oneLineTrim`
        <code>
          <span>123</span>
        </code>
      `;

    expect(getHTML(toDOMNode(codeNode))).toBe(expected);
  });

  it('should get toDOM for only registered renderer', () => {
    const toDOMNode = toDOMAdaptor.getToDOMNode('blockQuote');

    expect(toDOMNode).toBe(null);
  });
});
