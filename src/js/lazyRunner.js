/**
 * @fileoverview Implements LazyRunner
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import util from 'tui-code-snippet';

/**
 * Class LazyRunner
 */
class LazyRunner {
  /**
   * Creates an instance of LazyRunner.
   * @memberof LazyRunner
   */
  constructor() {
    this.globalTOID = null;
    this.lazyRunFunctions = {};
  }

  run(fn, params, context, delay) {
    let TOID;

    if (util.isString(fn)) {
      TOID = this._runRegisteredRun(fn, params, context, delay);
    } else {
      TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
      this.globalTOID = TOID;
    }

    return TOID;
  }

  registerLazyRunFunction(name, fn, delay, context) {
    context = context || this;

    this.lazyRunFunctions[name] = {
      fn,
      delay,
      context,
      TOID: null
    };
  }

  _runSingleRun(fn, params, context, delay, TOID) {
    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(() => {
      fn.call(context, params);
    }, delay);

    return TOID;
  }

  _runRegisteredRun(lazyRunName, params, context, delay) {
    const lazyRunFunction = this.lazyRunFunctions[lazyRunName];
    const {fn} = lazyRunFunction;
    let {TOID} = lazyRunFunction;
    delay = delay || lazyRunFunction.delay;
    context = context || lazyRunFunction.context;

    TOID = this._runSingleRun(fn, params, context, delay, TOID);

    lazyRunFunction.TOID = TOID;

    return TOID;
  }

  _clearTOIDIfNeed(TOID) {
    if (TOID) {
      clearTimeout(TOID);
    }
  }
}
export default LazyRunner;
