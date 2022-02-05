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

  getBindingEventNames() {
    return Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .filter((key) => this.props[key as EventNames]);
  }

  bindEventHandlers(props: ViewerProps) {
    this.getBindingEventNames().forEach((key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);

      this.viewerInst.off(eventName);
      this.viewerInst.on(eventName, props[key as EventNames]!);
    });
  }

  getInitEvents() {
    return this.getBindingEventNames().reduce(
      (acc: Record<string, EventMap[keyof EventMap]>, key) => {
        const eventName = (key[2].toLowerCase() + key.slice(3)) as keyof EventMap;

        acc[eventName] = this.props[key as EventNames];

        return acc;
      },
      {}
    );
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
