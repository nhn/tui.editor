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

describe('CodeBlockNode', () => {
  it('infoPadding is none', () => {
    const root = parser.parse('```js');
    const codeBlock = root.firstChild as CodeBlockNode;

    expect(codeBlock.infoPadding).toBe(0);
  });

  it('infoPadding is more than zero', () => {
    const root = parser.parse('```   js');
    const codeBlock = root.firstChild as CodeBlockNode;

    expect(codeBlock.infoPadding).toBe(3);
  });

  it('info string', () => {
    const root = parser.parse('```   javascript  ');
    const codeBlock = root.firstChild as CodeBlockNode;

    expect(codeBlock.info).toBe('javascript');
  });
});
