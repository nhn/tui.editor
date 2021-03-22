import React from 'react';
// @ts-ignore
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import { ViewerProps, EventNames } from '../index';

export default class ViewerComponent extends React.Component<ViewerProps> {
  rootEl = React.createRef<HTMLDivElement>();

  viewerInst!: Viewer;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.viewerInst;
  }

  bindEventHandlers(props: ViewerProps) {
    Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);

        this.viewerInst.off(eventName);
        this.viewerInst.on(eventName, props[key as EventNames]!);
      });
  }

  componentDidMount() {
    this.viewerInst = new Viewer({
      el: this.rootEl.current!,
      ...this.props,
    });

    this.bindEventHandlers(this.props);
  }

  shouldComponentUpdate(nextProps: ViewerProps) {
    this.bindEventHandlers(nextProps);

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
