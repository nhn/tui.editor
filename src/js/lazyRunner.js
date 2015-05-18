/**
 * @fileoverview Implements LazyRunner
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * LazyRunner
 * @exports LazyRunner
 * @augments
 * @constructor
 * @class
 */
function LazyRunner() {
    this.globalTOID = null;
    this.lazyRunFunctions = {};
}

LazyRunner.prototype.run = function(fn, delay) {
    var TOID;

    if (util.isString(fn)) {
        TOID = this._runRegisteredRun(fn, delay);
    } else {
        TOID = this._runSingleRun(fn, delay);
    }

    return TOID;
};

LazyRunner.prototype.registerLazyRunFunction = function(name, fn, delay, context) {
    context = context || this;

    this.lazyRunFunctions[name] = {
        fn: fn,
        delay: delay,
        context: context,
        TOID: null
    };
};

LazyRunner.prototype._runSingleRun = function(fn, delay) {
    var TOID = this.globalTOID;

    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(fn, delay);

    this.globalTOID = TOID;

    return TOID;
};

LazyRunner.prototype._runRegisteredRun = function(fn, delay) {
    var TOID,
        lazyRunName,
        context;

    lazyRunName = fn;
    fn = this.lazyRunFunctions[lazyRunName].fn;
    TOID = this.lazyRunFunctions[lazyRunName].TOID;
    delay = delay || this.lazyRunFunctions[lazyRunName].delay;
    context = this.lazyRunFunctions[lazyRunName].context;

    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(function() {
        fn.call(context);
    }, delay);

    this.lazyRunFunctions[lazyRunName].TOID = TOID;

    return TOID;
};

LazyRunner.prototype._clearTOIDIfNeed = function(TOID) {
    if (TOID) {
        clearTimeout(TOID);
    }
};

module.exports = LazyRunner;
