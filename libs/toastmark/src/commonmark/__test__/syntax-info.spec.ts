import { Parser } from '../blocks';
import { HeadingNode } from '../node';

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
