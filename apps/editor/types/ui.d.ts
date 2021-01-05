export interface Component<T = {}, R = {}> {
  props?: T;
  state?: R;
  addEvent?(): void;
  mounted?(): void;
  render(): any;
}

export interface ComponentClass {
  new (props?: Record<string, any>): Component;
}
