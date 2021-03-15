import '@testing-library/jest-dom';

global.Range.prototype.getClientRects = jest.fn().mockReturnValue({ length: 0 });

global.Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue({});
