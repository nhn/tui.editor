import React from 'react';
import Viewer from 'tui-editor/dist/tui-editor-Viewer';

export default class ViewerComponent extends React.Component {
  rootEl = React.createRef();

  viewerInst = null;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.viewerInst;
  }

  bindEventHandlers() {
    Object.keys(this.props)
      .filter((key) => /on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.viewerInst.on(eventName, this.props[key]);
      });
  }

  componentDidMount() {
    this.viewerInst = new Viewer({
      el: this.rootEl.current,
      ...this.props
    });

    this.bindEventHandlers();
  }

  shouldComponentUpdate(nextProps) {
    const currentValue = this.props.initialValue;
    const nextValue = nextProps.initialValue;

    if (currentValue !== nextValue) {
      this.getInstance().setValue(nextValue);
    }

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
