// derived from https://github.com/mathiasbynens/String.fromCodePoint
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
let fromCodePoint: (c: number) => string;

if (String.fromCodePoint) {
  fromCodePoint = function(_) {
    try {
      return String.fromCodePoint(_);
    } catch (e) {
      if (e instanceof RangeError) {
        return String.fromCharCode(0xfffd);
      }
      throw e;
    }
  };
} else {
  const stringFromCharCode = String.fromCharCode;
  const floor = Math.floor;
  fromCodePoint = function(...args) {
    const MAX_SIZE = 0x4000;
    const codeUnits = [];
    let highSurrogate: number;
    let lowSurrogate: number;
    let index = -1;
    const length = args.length;
    if (!length) {
      return '';
    }
    let result = '';
    while (++index < length) {
      let codePoint = Number(args[index]);
      if (
        !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
        codePoint < 0 || // not a valid Unicode code point
        codePoint > 0x10ffff || // not a valid Unicode code point
        floor(codePoint) !== codePoint // not an integer
      ) {
        return String.fromCharCode(0xfffd);
      }
      if (codePoint <= 0xffff) {
        // BMP code point
        codeUnits.push(codePoint);
      } else {
        // Astral code point; split in surrogate halves
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xd800;
        lowSurrogate = (codePoint % 0x400) + 0xdc00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
      if (index + 1 === length || codeUnits.length > MAX_SIZE) {
        result += stringFromCharCode(...codeUnits);
        codeUnits.length = 0;
      }
    }
    return result;
  };
}

export default fromCodePoint;
