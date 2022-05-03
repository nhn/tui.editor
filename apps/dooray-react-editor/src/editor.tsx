import React from 'react';
import Editor, { EventMap } from '@toast-ui/editor';
import type { EditorProps, EventNames } from '../index';

export default class extends React.Component<EditorProps> {
  rootEl = React.createRef<HTMLDivElement>();

  editorInst!: Editor;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.editorInst;
  }

  getBindingEventNames() {
    return Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .filter((key) => this.props[key as EventNames]);
  }

  bindEventHandlers(props: EditorProps) {
    this.getBindingEventNames().forEach((key) => {
      const eventName = key[2].toLowerCase() + key.slice(3);

      this.editorInst.off(eventName);
      this.editorInst.on(eventName, props[key as EventNames]!);
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
    this.editorInst = new Editor({
      el: this.rootEl.current!,
      ...this.props,
      events: this.getInitEvents(),
    });
  }

  shouldComponentUpdate(nextProps: EditorProps) {
    const instance = this.getInstance();
    const { height, previewStyle } = nextProps;

    if (height && this.props.height !== height) {
      instance.setHeight(height);
    }

    if (previewStyle && this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }

    this.bindEventHandlers(nextProps);

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
