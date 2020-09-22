import React from 'react';
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

export default class ViewerComponent extends React.Component {
  rootEl = React.createRef();

  viewerInst = null;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.viewerInst;
  }

  bindEventHandlers(props) {
    Object.keys(this.props)
      .filter(key => /^on[A-Z][a-zA-Z]+/.test(key))
      .forEach(key => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.viewerInst.off(eventName);
        this.viewerInst.on(eventName, props[key]);
      });
  }

  componentDidMount() {
    this.viewerInst = new Viewer({
      el: this.rootEl.current,
      ...this.props
    });

    this.bindEventHandlers(this.props);
  }

  shouldComponentUpdate(nextProps) {
    this.bindEventHandlers(nextProps, this.props);

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
