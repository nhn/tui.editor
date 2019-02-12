import React from 'react';
import Editor from 'tui-editor';

export default class extends React.Component {
  rootEl = React.createRef();
  editorInst = null;

  getRootElement() {
    return this.rootEl.current;
  }

  getInstance() {
    return this.editorInst;
  }

  bindEventHandlers() {
    Object.keys(this.props)
      .filter((key) => /on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        this.editorInst.on(eventName, this.props[key]);
      });
  }

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current,
      ...this.props
    });

    this.bindEventHandlers();
  }

  shouldComponentUpdate(nextProps) {
    const instance = this.getInstance();
    const {
      initialValue,
      initialEditType,
      height,
      previewStyle
    } = nextProps;

    if (this.props.initialValue !== initialValue) {
      instance.setValue(initialValue);
    }

    if (this.props.height !== height) {
      instance.height(height);
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }

    if(this.props.initialEditType !== initialEditType) {
      instance.changeMode(initialEditType)
    }

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
