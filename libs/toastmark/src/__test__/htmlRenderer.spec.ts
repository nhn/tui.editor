import { createHTMLRender } from '../htmlRenderer';
import { Parser } from '../commonmark/blocks';

const reader = new Parser();
const render = createHTMLRender();

it('heading', () => {
  const root = reader.parse('# Hello');

  expect(render(root)).toBe('<h1>Hello</h1>');
});

it('heading 2', () => {
  const root = reader.parse('## Hello');

  expect(render(root)).toBe('<h2>Hello</h2>');
});

it('paragraph', () => {
  const root = reader.parse('*Hello*\n**World**');

  expect(render(root)).toBe('<p><em>Hello</em>\n<strong>World</strong></p>');
});

it('inline code', () => {
  const root = reader.parse('`Hello`');

  expect(render(root)).toBe('<p><code>Hello</code></p>');
});

it('code block', () => {
  const root = reader.parse('```javascript\nHello\n```');

  expect(render(root)).toBe('<pre><code class="language-javascript">Hello\n</code></pre>');
});

it('image', () => {
  const root = reader.parse('![**Hello** *World*](URL)');

  expect(render(root)).toBe('<p><img src="URL" alt="Hello World" /></p>');
});
