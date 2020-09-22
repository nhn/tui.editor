import inArray from 'tui-code-snippet/array/inArray';
import { Mapable } from '@t/map';

/**
 * @class
 * @ignore
 * @classdesc ES6 Map
 */
class Map<K, V> implements Mapable<K, V> {
  private keys: K[];

  private values: V[];

  constructor() {
    this.keys = [];
    this.values = [];
  }

  private getKeyIndex(key: K) {
    return inArray(key, this.keys);
  }

  get(key: K): V {
    return this.values[this.getKeyIndex(key)];
  }

  set(key: K, value: V) {
    const keyIndex = this.getKeyIndex(key);

    if (keyIndex > -1) {
      this.values[keyIndex] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }
    return this;
  }

  has(key: K) {
    return this.getKeyIndex(key) > -1;
  }

  delete(key: K) {
    const keyIndex = this.getKeyIndex(key);

    if (keyIndex > -1) {
      this.keys.splice(keyIndex, 1);
      this.values.splice(keyIndex, 1);

      return true;
    }
    return false;
  }

  forEach(callback: (value: V, key: K, map: Mapable<K, V>) => void, thisArg = this) {
    this.values.forEach((value, index) => {
      if (value && this.keys[index]) {
        callback.call(thisArg, value, this.keys[index], this);
      }
    });
  }

  clear() {
    this.keys = [];
    this.values = [];
  }
}

export default Map;
