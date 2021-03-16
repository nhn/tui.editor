import '@testing-library/jest-dom';

if (global.Range) {
  global.Range.prototype.getClientRects = jest.fn().mockReturnValue({ length: 0 });
  global.Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue({});
}
