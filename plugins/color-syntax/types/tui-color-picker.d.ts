interface ColorPickerOption {
  container: HTMLElement;
  preset?: string[];
}

declare module 'tui-color-picker' {
  interface ColorPicker {
    getColor(): string;
    slider: {
      toggle(type: boolean): void;
    };
  }

  function create(options: ColorPickerOption): ColorPicker;
}
