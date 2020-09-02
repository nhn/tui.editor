import { Schema } from 'prosemirror-model';

const basic = {
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      group: 'block',
      content: 'inline*',
      marks: '_',
      toDOM() {
        return ['p', 0];
      },
      parseDOM: [{ tag: 'p' }]
    },
    text: {
      group: 'inline'
    }
  },
  marks: {
    strong: {},
    em: {},
    del: {}
  }
};

export const basicSchema = new Schema(basic);
