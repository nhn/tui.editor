import { Parser } from '../blocks';
import { createRenderHTML } from '../../html/render';
import specs from './base-examples.json';

const reader = new Parser({ referenceDefinition: true });
const render = createRenderHTML();

specs.forEach(spec => {
  const { example, section, markdown, html } = spec;

  it(`Example ${example} (${section})`, () => {
    const parsed = reader.parse(markdown);
    const result = render(parsed);

    expect(result).toBe(html);
  });
});
