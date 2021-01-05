import { oneLineTrim } from 'common-tags';
import { render } from '@/new/renderer';
import { VNode } from '@/new/vdom/vnode';
import html from '@/new/vdom/template';

it('vnode should be rendered properly', () => {
  const container = document.createElement('div');

  render(
    container,
    html`
      <div class="my-comp" data-id="my-comp">test</div>
    ` as VNode
  );

  expect(container).toContainHTML('<div class="my-comp" data-id="my-comp">test</div>');
});

it('list children should be rendered properly', () => {
  const container = document.createElement('div');
  const expected = oneLineTrim`
    <div>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  `;

  render(
    container,
    html`
      <div>
        ${[1, 2, 3].map(
          text =>
            html`
              <span>${text}</span>
            `
        )}
      </div>
    ` as VNode
  );

  expect(container).toContainHTML(expected);
});

it('nested vnode should be rendered properly', () => {
  const container = document.createElement('div');
  const expected = oneLineTrim`
    <div class="my-comp" data-id="my-comp">
      <nav>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </nav>
    </div>
  `;

  render(
    container,
    html`
      <div class="my-comp" data-id="my-comp">
        <nav>
          <ul>
            ${['1', '2', '3'].map(
              text =>
                html`
                  <li>${text}</li>
                `
            )}
          </ul>
        </nav>
      </div>
    ` as VNode
  );

  expect(container).toContainHTML(expected);
});
