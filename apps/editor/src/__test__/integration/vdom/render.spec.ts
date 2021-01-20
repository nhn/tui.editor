import { oneLineTrim } from 'common-tags';
import { render } from '@/new/renderer';
import { Component } from '@/new/vdom/component';
import { VNode } from '@/new/vdom/vnode';
import html from '@/new/vdom/template';

interface Props {
  mounted?: jest.Mock;
  updated?: jest.Mock;
  beforeDestroy?: jest.Mock;
  ref?: jest.Mock<any, [HTMLElement]>;
}

interface State {
  hide: boolean;
}

class TestComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hide: false
    };
  }

  show() {
    this.setState({ hide: false });
  }

  hide() {
    this.setState({ hide: true });
  }

  mounted() {
    if (this.props.mounted) {
      this.props.mounted();
    }
  }

  updated() {
    if (this.props.updated) {
      this.props.updated();
    }
  }

  beforeDestroy() {
    if (this.props.beforeDestroy) {
      this.props.beforeDestroy();
    }
  }

  render() {
    const style = {
      display: this.state.hide ? 'none' : 'block'
    };

    return html`
      <div
        class="my-comp"
        ref=${(el: HTMLElement) => {
          if (this.props.ref) {
            this.props.ref(el);
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

let container: HTMLElement, destroy: () => void;

function clickShowBtn() {
  container.querySelector('button')!.click();
}

function clickHideBtn() {
  container.querySelectorAll('button')[1].click();
}

describe('html', () => {
  it('should be rendered properly', () => {
    const wrapper = document.createElement('div');

    render(
      wrapper,
      html`
        <div class="my-comp" data-id="my-comp">test</div>
      ` as VNode
    );

    expect(wrapper).toContainHTML('<div class="my-comp" data-id="my-comp">test</div>');
  });

  it('list children should be rendered properly', () => {
    const wrapper = document.createElement('div');
    const expected = oneLineTrim`
      <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
      </div>
    `;

    render(
      wrapper,
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

    expect(wrapper).toContainHTML(expected);
  });

  it('nested vnode should be rendered properly', () => {
    const wrapper = document.createElement('div');
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
      wrapper,
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

    expect(wrapper).toContainHTML(expected);
  });

  it('should be rendered with style object properly', () => {
    const wrapper = document.createElement('div');
    const style = { display: 'inline-block', backgroundColor: '#ccc' };
    const expected = oneLineTrim`
      <div class="my-comp" style="display: inline-block; background-color: rgb(204, 204, 204);">test</div>
    `;

    render(
      wrapper,
      html`
        <div class="my-comp" style=${style}>test</div>
      ` as VNode
    );

    expect(wrapper).toContainHTML(expected);
  });

  it('should be rendered with pixel added automatically', () => {
    const wrapper = document.createElement('div');
    const style = { position: 'absolute', top: 10, left: 10 };
    const expected = oneLineTrim`
      <div class="my-comp" style="position: absolute; top: 10px; left: 10px;">test</div>
    `;

    render(
      wrapper,
      html`
        <div class="my-comp" style=${style}>test</div>
      ` as VNode
    );

    expect(wrapper).toContainHTML(expected);
  });
});

describe('Class Component', () => {
  function renderComponent(spies?: Record<string, jest.Mock>) {
    container = document.createElement('div');

    destroy = render(
      container,
      html`
        <${TestComponent} ...${spies} />
      ` as VNode
    );
  }

  it('should be rendered properly', () => {
    renderComponent();

    const expected = oneLineTrim`
      <div class="my-comp">
        <div style="display: block;">child</div>
        <button>show</button>
        <button>hide</button>
      </div>
    `;

    expect(container).toContainHTML(expected);
  });

  it('should be updated by event', () => {
    renderComponent();
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

  it('should call ref function property after rendering the component', () => {
    const spy = jest.fn();

    renderComponent({ ref: spy });

    expect(spy).toHaveBeenCalledWith(container.querySelector('.my-comp'));
  });

  it('should call mounted life cycle method ', () => {
    const spy = jest.fn();

    renderComponent({ mounted: spy });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call mounted life cycle method once', () => {
    const spy = jest.fn();

    renderComponent({ mounted: spy });
    clickHideBtn();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call updated life cycle method after component is updated', () => {
    const spy = jest.fn();

    renderComponent({ updated: spy });

    clickHideBtn();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call beforeDestroy life cycle method after component is destroyed', () => {
    const spy = jest.fn();

    renderComponent({ beforeDestroy: spy });

    destroy();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(container).toContainHTML('');
  });
});
