import React from 'react';
import Viewer, { EventMap } from '@toast-ui/editor/dist/toastui-editor-viewer';
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

  getInitEvents() {
    return Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .reduce((acc: Record<string, EventMap[keyof EventMap]>, key) => {
        const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

        acc[eventName] = this.props[key as EventNames];

        return acc;
      }, {});
  }

  componentDidMount() {
    this.viewerInst = new Viewer({
      el: this.rootEl.current!,
      ...this.props,
      events: this.getInitEvents(),
    });
  }

  shouldComponentUpdate(nextProps: ViewerProps) {
    this.bindEventHandlers(nextProps);

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
