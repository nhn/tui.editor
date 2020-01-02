import { Parser } from '../blocks';

it('Parser', () => {
  const parser = new Parser();
  const root = parser.parse('# Hello');

  expect(root.type).toBe('document');
  expect(root.firstChild!.type).toBe('heading');
});
