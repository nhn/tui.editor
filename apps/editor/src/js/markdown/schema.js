import { Schema } from 'prosemirror-model';
import { cls } from '../utils/dom';

const simpleMarkMap = {
  blockQuote: ['block-quote'],
  codeBlock: ['code-block'],
  table: ['table'],
  thematicBreak: ['thematic-break'],
  seText: ['delimiter', 'seText'],
  emph: ['emph'],
  strike: ['strike'],
  strong: ['strong'],
  taskDelimiter: ['delimiter', 'list-item'],
  delimiter: ['delimiter'],
  meta: ['meta'],
  markedText: ['marked-text'],
  html: ['html']
};

function createNodeSpecs(specs) {
  return {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      attrs: {
        className: { default: null }
      },
      group: 'block',
      parseDOM: [{ tag: 'div' }],
      toDOM({ attrs }) {
        if (attrs.className) {
          return ['div', { class: cls(attrs.className) }, 0];
        }
        return ['div', 0];
      }
    },
    text: {
      group: 'inline'
    },
    // @TODO: add block node(line node) spec option
    ...specs
  };
}

function createMarkSpecs(specs) {
  const marks = {
    heading: {
      attrs: {
        level: { default: 1 }
      },
      toDOM(mark) {
        return ['span', { class: cls('heading', `heading${mark.attrs.level}`) }, 0];
      }
    },
    link: {
      attrs: {
        url: { default: false },
        desc: { default: false }
      },
      toDOM(mark) {
        const { url, desc } = mark.attrs;
        let classNames = 'link';

        if (url) {
          classNames += '|link-url|marked-text';
        }
        if (desc) {
          classNames += '|link-desc|marked-text';
        }

        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    },
    code: {
      attrs: {
        start: { default: false },
        end: { default: false },
        marked: { default: false }
      },
      toDOM(mark) {
        const { start, end, marked } = mark.attrs;
        let classNames = 'code';

        if (start) {
          classNames += '|delimiter|start';
        }
        if (end) {
          classNames += '|delimiter|end';
        }
        if (marked) {
          classNames += '|marked-text';
        }

        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    },
    listItem: {
      attrs: {
        odd: { default: false },
        even: { default: false },
        listStyle: { default: false }
      },
      toDOM(mark) {
        const { odd, even, listStyle } = mark.attrs;
        let classNames = 'list-item';

        if (listStyle) {
          classNames += '|list-item-style';
        }
        if (odd) {
          classNames += '|list-item-odd';
        }
        if (even) {
          classNames += '|list-item-even';
        }
        return ['span', { class: cls(...classNames.split('|')) }, 0];
      }
    }
  };

  Object.keys(simpleMarkMap).forEach(type => {
    marks[type] = {
      toDOM() {
        return ['span', { class: cls(...simpleMarkMap[type]) }, 0];
      }
    };
  });

  // @TODO: add syntax higlighting spec option
  return { ...marks, ...specs };
}

export const schema = new Schema({
  nodes: createNodeSpecs(),
  marks: createMarkSpecs()
});
