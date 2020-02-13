import inArray from 'tui-code-snippet/array/inArray';
import forEachArray from 'tui-code-snippet/collection/forEachArray';

/**
 * @class
 * @ignore
 * @classdesc ES6 Map
 */
class Map {
  constructor() {
    this._keys = [];
    this._values = [];
  }

  _getKeyIndex(key) {
    return inArray(key, this._keys);
  }

  get(key) {
    return this._values[this._getKeyIndex(key)];
  }

  set(key, value) {
    const keyIndex = this._getKeyIndex(key);

    if (keyIndex > -1) {
      this._values[keyIndex] = value;
    } else {
      this._keys.push(key);
      this._values.push(value);
    }
  }

  has(key) {
    return this._getKeyIndex(key) > -1;
  }

  delete(key) {
    const keyIndex = this._getKeyIndex(key);

    if (keyIndex > -1) {
      this._keys.splice(keyIndex, 1);
      this._values.splice(keyIndex, 1);
    }
  }

  forEach(callback, thisArg = this) {
    forEachArray(this._values, (value, index) => {
      if (value && this._keys[index]) {
        callback.call(thisArg, value, this._keys[index], this);
      }
    });
  }
}

export default Map;
