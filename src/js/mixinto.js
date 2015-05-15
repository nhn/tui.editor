/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * mix
 * @exports mix
 */
function mix() {
    var args = [{}].concat(util.toArray(arguments));
    return {
        obj: util.extend.apply(null, args),
        into: into
    };
}

function into(targetObject) {
    util.forEach(this.obj, function(value, key) {
        if (!targetObject.hasOwnProperty(key)) {
            targetObject[key] = value;
        }
    });

    return targetObject;
}

module.exports = mix;
