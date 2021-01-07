import { oneLineTrim } from 'common-tags';
import { render, rerender } from '@/new/renderer';
import { VNode } from '@/new/vdom/vnode';
import html from '@/new/vdom/template';
import { shallowEqual } from '@/utils/common';

type RefSpy = jest.Mock<any, [HTMLElement]>;

interface Props {
  spy: jest.Mock<any, any>;
  refSpy: RefSpy;
}

interface State {
  hide: boolean;
}

class Component {
  props: Props;

  state: State;

  constructor(props: Props) {
    this.props = props;
    this.state = {
      hide: false
    };
  }

  setState(state: Partial<State>) {
    const newState = { ...this.state, ...state };

    if (!shallowEqual(this.state, newState)) {
      this.state = newState;
      rerender();
    }
  }

  show() {
    this.setState({ hide: false });
  }

  hide() {
    this.setState({ hide: true });
  }

  mounted() {
    this.props.spy();
  }

  render() {
    const style = {
      display: this.state.hide ? 'none' : 'block'
    };

    return html`
      <div
        class="my-comp"
        ref=${(el: HTMLElement) => {
          if (this.props.refSpy) {
            this.props.refSpy(el);
          }
        }}
      >
        <div style=${style}>
          child
        </div>
        <button onClick=${() => this.show()}>show</button>
        <button onClick=${() => this.hide()}>hide</button>
      </div>
    `;
  }
}

let container: HTMLElement;

function renderComponent(spy: Function, refSpy?: RefSpy) {
  container = document.createElement('div');

  render(
    container,
    html`
      <${Component} spy=${spy} refSpy=${refSpy} />
    ` as VNode
  );
}

function clickShowBtn() {
  container.querySelector('button')!.click();
}

function clickHideBtn() {
  container.querySelectorAll('button')[1].click();
}

it('component should be rendered properly', () => {
  renderComponent(jest.fn());

  const expected = oneLineTrim`
    <div class="my-comp">
      <div style="display: block;">child</div>
      <button>show</button>
      <button>hide</button>
    </div>
  `;

  expect(container).toContainHTML(expected);
});

it('component should be updated by event', () => {
  const spy = jest.fn();

  renderComponent(spy);
  clickHideBtn();

  let expected = oneLineTrim`
    <div class="my-comp">
      <div style="display: none;">child</div>
      <button>show</button>
      <button>hide</button>
    </div>
  `;

  expect(container).toContainHTML(expected);

  clickShowBtn();

  expected = oneLineTrim`
    <div class="my-comp">
      <div style="display: block;">child</div>
      <button>show</button>
      <button>hide</button>
    </div>
  `;

  expect(container).toContainHTML(expected);
});

it('mounted life cycle method should be called', () => {
  const spy = jest.fn();

  renderComponent(spy);

  expect(spy).toHaveBeenCalledTimes(1);
});

it('mounted life cycle method should be called once', () => {
  const spy = jest.fn();

  renderComponent(spy);
  clickHideBtn();

  expect(spy).toHaveBeenCalledTimes(1);
});

it('ref function property should be called after rendering the component', () => {
  const spy = jest.fn();

  renderComponent(jest.fn(), spy);

  expect(spy).toHaveBeenCalledWith(container.querySelector('.my-comp'));
});
