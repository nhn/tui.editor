/* Copyright © 2011-2012 by Neil Jenkins. Licensed under the MIT license. */

( function ( undefined ) {

/*jshint strict: false */

// Note: Does not inclue the `if ( i in this ) {}` check these function should
// have, as IE8 will return false if this[i] is undefined (at least if the array
// was defined with a literal, e.g. `[ undefined, undefined ]`).

Array.prototype.indexOf = function ( item, from ) {
    var l = this.length;
    for ( var i = ( from < 0 ) ? Math.max( 0, l + from ) : from || 0;
            i < l; i += 1 ) {
        if ( this[i] === item ) {
            return i;
        }
    }
    return -1;
};

Array.prototype.forEach = function ( fn, bind ) {
    var l = this.length >>> 0;
    if ( typeof fn !== 'function' ) {
        throw new TypeError();
    }
    for ( var i = 0; i < l; i += 1 ) {
        fn.call( bind, this[i], i, this );
    }
};

Array.prototype.filter = function ( fn, bind ) {
    var results = [];
    for ( var i = 0, l = this.length; i < l; i += 1 ) {
        var value = this[i];
        if ( fn.call( bind, value, i, this ) ) {
            results.push( value );
        }
    }
    return results;
};

Object.keyOf = function ( object, value ) {
    for ( var key in object ) {
        if ( object[ key ] === value ) {
            return key;
        }
    }
};

Date.now = function () {
    return +( new Date() );
};

String.prototype.trim = function () {
    var str = this.replace( /^\s\s*/, '' ),
        ws = /\s/,
        i = str.length;
    while ( ws.test( str.charAt( i -= 1 ) ) ) {/* Empty! */}
    return str.slice( 0, i + 1 );
};

}() );