import { Parser } from '../blocks';
import { Renderer } from '../../html/renderer';
import specs from './base-examples.json';

const reader = new Parser({ referenceDefinition: true });
const renderer = new Renderer();

specs.forEach((spec) => {
  const { example, section, markdown, html } = spec;

  it(`Example ${example} (${section})`, () => {
    const parsed = reader.parse(markdown);
    const result = renderer.render(parsed);

    expect(result).toBe(html);
  });
});
