import { Parser } from '../blocks';
import { HeadingNode, CodeBlockNode } from '../node';

const parser = new Parser();

describe('headingType ', () => {
  it('atx heading', () => {
    const root = parser.parse('# Heading');
    const heading = root.firstChild as HeadingNode;

    expect(heading.headingType).toBe('atx');
  });

  it('setext heading', () => {
    const root = parser.parse('Heading\n----');
    const heading = root.firstChild as HeadingNode;

    expect(heading.headingType).toBe('setext');
  });
});

describe(`CodeBlockNode's infoPadding`, () => {
  it('none', () => {
    const root = parser.parse('```js');
    const codeBlock = root.firstChild as CodeBlockNode;

    expect(codeBlock.infoPadding).toBe(0);
  });

  it('more than zero', () => {
    const root = parser.parse('```   js');
    const codeBlock = root.firstChild as CodeBlockNode;

    expect(codeBlock.infoPadding).toBe(3);
  });
});
