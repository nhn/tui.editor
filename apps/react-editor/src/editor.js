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

  bindEventHandlers(props, prevProps) {
    Object.keys(props)
      .filter((key) => /on[A-Z][a-zA-Z]+/.test(key))
      .forEach((key) => {
        const eventName = key[2].toLowerCase() + key.slice(3);
        // For <Editor onFocus={condition ? onFocus1 : onFocus2} />
        if(prevProps && prevProps[key] !== props[key]) {
          this.editorInst.off(eventName);
        }
        this.editorInst.on(eventName, props[key]);
      });
  }

  componentDidMount() {
    this.editorInst = new Editor({
      el: this.rootEl.current,
      ...this.props
    });

    this.bindEventHandlers(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const instance = this.getInstance();
    const {height, previewStyle} = nextProps;

    if (this.props.height !== height) {
      instance.height(height);
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle);
    }

    this.bindEventHandlers(nextProps, this.props);

    return false;
  }

  render() {
    return <div ref={this.rootEl} />;
  }
}
