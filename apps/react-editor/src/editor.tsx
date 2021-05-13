import React from 'react';
import Editor from '@toast-ui/editor';
import { EditorProps, EventNames } from '../index';

export default class extends React.Component<EditorProps> {
  rootEl = React.createRef<HTMLDivElement>();

  editorInst!: Editor;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.editorInst;
  }

  bindEventHandlers(props: EditorProps) {
    Object.keys(this.props)
      .filter((key) => /^on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);

        this.editorInst.off(eventName);
        this.editorInst.on(eventName, props[key as EventNames]!);
      });
  }

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current!,
      ...this.props,
    });

    this.bindEventHandlers(this.props);
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
