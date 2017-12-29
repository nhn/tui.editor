/* eslint-disable */
/*
 CSV-JS - A Comma-Separated Values parser for JS

 Built to rfc4180 standard, with options for adjusting strictness:
    - optional carriage returns for non-microsoft sources
    - automatically type-cast numeric an boolean values
    - relaxed mode which: ignores blank lines, ignores gargabe following quoted tokens, does not enforce a consistent record length

 Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 Author Greg Kindel (twitter @gkindel), 2014
 */
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

(function (global) {
    'use strict';
    /**
     * @name CSV
     * @namespace
     * @ignore
     */
    // implemented as a singleton because JS is single threaded
    var CSV = {};
    CSV.RELAXED = false;
    CSV.IGNORE_RECORD_LENGTH = false;
    CSV.IGNORE_QUOTES = false;
    CSV.LINE_FEED_OK = true;
    CSV.CARRIAGE_RETURN_OK = true;
    CSV.DETECT_TYPES = true;
    CSV.IGNORE_QUOTE_WHITESPACE = true;
    CSV.DEBUG = false;

    CSV.COLUMN_SEPARATOR = ",";

    CSV.ERROR_EOF = "UNEXPECTED_END_OF_FILE";
    CSV.ERROR_CHAR = "UNEXPECTED_CHARACTER";
    CSV.ERROR_EOL = "UNEXPECTED_END_OF_RECORD";
    CSV.WARN_SPACE = "UNEXPECTED_WHITESPACE"; // not per spec, but helps debugging

    var QUOTE = "\"",
        CR = "\r",
        LF = "\n",
        SPACE = " ",
        TAB = "\t";

    // states
    var PRE_TOKEN = 0,
        MID_TOKEN = 1,
        POST_TOKEN = 2,
        POST_RECORD = 4;
    /**
     * @name CSV.parse
     * @function
     * @description rfc4180 standard csv parse
     * with options for strictness and data type conversion
     * By default, will automatically type-cast numeric an boolean values.
     * @param {String} str A CSV string
     * @return {Array} An array records, each of which is an array of scalar values.
     * @example
     * // simple
     * var rows = CSV.parse("one,two,three\nfour,five,six")
     * // rows equals [["one","two","three"],["four","five","six"]]
     * @example
     * // Though not a jQuery plugin, it is recommended to use with the $.ajax pipe() method:
     * $.get("csv.txt")
     *    .pipe( CSV.parse )
     *    .done( function(rows) {
     *        for( var i =0; i < rows.length; i++){
     *            console.log(rows[i])
     *        }
     *  });
     * @see http://www.ietf.org/rfc/rfc4180.txt
     */
    CSV.parse = function (str) {
        var result = CSV.result = [];
        CSV.COLUMN_SEPARATOR = CSV.COLUMN_SEPARATOR instanceof RegExp ?
            new RegExp('^' + CSV.COLUMN_SEPARATOR.source) : CSV.COLUMN_SEPARATOR;

        CSV.offset = 0;
        CSV.str = str;
        CSV.record_begin();

        CSV.debug("parse()", str);

        var c;
        while( 1 ){
            // pull char
            c = str[CSV.offset++];
            CSV.debug("c", c);

            // detect eof
            if (c == null) {
                if( CSV.escaped ) {
                    CSV.error(CSV.ERROR_EOF);
                }

                if( CSV.record ){
                    CSV.token_end();
                    CSV.record_end();
                }

                CSV.debug("...bail", c, CSV.state, CSV.record);
                CSV.reset();
                break;
            }

            if( CSV.record == null ){
                // if relaxed mode, ignore blank lines
                if( CSV.RELAXED && (c == LF || c == CR && str[CSV.offset + 1] == LF) ){
                    continue;
                }
                CSV.record_begin();
            }

            // pre-token: look for start of escape sequence
            if (CSV.state == PRE_TOKEN) {

                if ( (c === SPACE || c === TAB) && CSV.next_nonspace() == QUOTE ){
                    if( CSV.RELAXED || CSV.IGNORE_QUOTE_WHITESPACE ) {
                        continue;
                    }
                    else {
                        // not technically an error, but ambiguous and hard to debug otherwise
                        CSV.warn(CSV.WARN_SPACE);
                    }
                }

                if (c == QUOTE && ! CSV.IGNORE_QUOTES) {
                    CSV.debug("...escaped start", c);
                    CSV.escaped = true;
                    CSV.state = MID_TOKEN;
                    continue;
                }
                CSV.state = MID_TOKEN;
            }

            // mid-token and escaped, look for sequences and end quote
            if (CSV.state == MID_TOKEN && CSV.escaped) {
                if (c == QUOTE) {
                    if (str[CSV.offset] == QUOTE) {
                        CSV.debug("...escaped quote", c);
                        CSV.token += QUOTE;
                        CSV.offset++;
                    }
                    else {
                        CSV.debug("...escaped end", c);
                        CSV.escaped = false;
                        CSV.state = POST_TOKEN;
                    }
                }
                else {
                    CSV.token += c;
                    CSV.debug("...escaped add", c, CSV.token);
                }
                continue;
            }

            // fall-through: mid-token or post-token, not escaped
            if (c == CR ) {
                if( str[CSV.offset] == LF  )
                    CSV.offset++;
                else if( ! CSV.CARRIAGE_RETURN_OK )
                    CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            }
            else if (c == LF) {
                if( ! (CSV.LINE_FEED_OK || CSV.RELAXED) )
                    CSV.error(CSV.ERROR_CHAR);
                CSV.token_end();
                CSV.record_end();
            }
            else if (CSV.test_regex_separator(str) || CSV.COLUMN_SEPARATOR == c) {
                CSV.token_end();
            }
            else if( CSV.state == MID_TOKEN ){
                CSV.token += c;
                CSV.debug("...add", c, CSV.token);
            }
            else if ( c === SPACE || c === TAB) {
                if (! CSV.IGNORE_QUOTE_WHITESPACE )
                    CSV.error(CSV.WARN_SPACE );
            }
            else if( ! CSV.RELAXED ){
                CSV.error(CSV.ERROR_CHAR);
            }
        }
        return result;
    };

    /**
     * @name CSV.stream
     * @function
     * @description stream a CSV file
     * @example
     * node -e "c=require('CSV-JS');require('fs').createReadStream('csv.txt').pipe(c.stream()).pipe(c.stream.json()).pipe(process.stdout)"
     * @ignore
     */
    CSV.stream = function () {
        var stream = require('stream');
        var s = new stream.Transform({objectMode: true});
        s.EOL = '\n';
        s.prior = "";
        s.emitter = function(s) {
            return function(e) {
                s.push(CSV.parse(e+s.EOL))
            }
        }(s);

        s._transform = function(chunk, encoding, done) {
            var lines = (this.prior == "") ?
                chunk.toString().split(this.EOL) :
                (this.prior + chunk.toString()).split(this.EOL);
            this.prior = lines.pop();
            lines.forEach(this.emitter);
            done()
        };

        s._flush = function(done) {
            if (this.prior != "") {
                this.emitter(this.prior)
                this.prior = ""
            }
            done()
        };
        return s
    };

    CSV.test_regex_separator = function(str) {
        if (!(CSV.COLUMN_SEPARATOR instanceof RegExp)) {
            return false;
        }

        var match;
        str = str.slice(CSV.offset - 1);
        match = CSV.COLUMN_SEPARATOR.exec(str);
        if (match) {
            CSV.offset += match[0].length - 1;
        }

        return match !== null;
    };

    CSV.stream.json = function () {
        var os = require('os');
        var stream = require('stream');
        var s = new streamTransform({objectMode: true});
        s._transform = function(chunk, encoding, done) {
            s.push(JSON.stringify(chunk.toString())+os.EOL);
            done()
        };
        return s
    };

    CSV.reset = function () {
        CSV.state = null;
        CSV.token = null;
        CSV.escaped = null;
        CSV.record = null;
        CSV.offset = null;
        CSV.result = null;
        CSV.str = null;
    };

    CSV.next_nonspace = function () {
        var i = CSV.offset;
        var c;
        while( i < CSV.str.length ) {
            c = CSV.str[i++];
            if( !( c == SPACE || c === TAB ) ){
                return c;
            }
        }
        return null;
    };

    CSV.record_begin = function () {
        CSV.escaped = false;
        CSV.record = [];
        CSV.token_begin();
        CSV.debug("record_begin");
    };

    CSV.record_end = function () {
        CSV.state = POST_RECORD;
        if( ! (CSV.IGNORE_RECORD_LENGTH || CSV.RELAXED) && CSV.result.length > 0 && CSV.record.length !=  CSV.result[0].length ){
            CSV.error(CSV.ERROR_EOL);
        }
        CSV.result.push(CSV.record);
        CSV.debug("record end", CSV.record);
        CSV.record = null;
    };

    CSV.resolve_type = function (token) {
        if( token.match(/^[-+]?[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?$/) ){
            token = parseFloat(token);
        }
        else if( token.match(/^(true|false)$/i) ){
            token = Boolean( token.match(/true/i) );
        }
        else if(token === "undefined" ){
            token = undefined;
        }
        else if(token === "null" ){
            token = null;
        }
        return token;
    };

    CSV.token_begin = function () {
        CSV.state = PRE_TOKEN;
        // considered using array, but http://www.sitepen.com/blog/2008/05/09/string-performance-an-analysis/
        CSV.token = "";
    };

    CSV.token_end = function () {
        if( CSV.DETECT_TYPES ) {
            CSV.token = CSV.resolve_type(CSV.token);
        }
        CSV.record.push(CSV.token);
        CSV.debug("token end", CSV.token);
        CSV.token_begin();
    };

    CSV.debug = function (){
        if( CSV.DEBUG )
            console.log(arguments);
    };

    CSV.dump = function (msg) {
        return [
            msg , "at char", CSV.offset, ":",
            CSV.str.substr(CSV.offset- 50, 50)
                .replace(/\r/mg,"\\r")
                .replace(/\n/mg,"\\n")
                .replace(/\t/mg,"\\t")
        ].join(" ");
    };

    CSV.error = function (err){
        var msg = CSV.dump(err);
        CSV.reset();
        throw msg;
    };

    CSV.warn = function (err){
        if (!CSV.DEBUG) {
            return;
        }

        var msg = CSV.dump(err);
        try {
            console.warn( msg );
            return;
        } catch (e) {}

        try {
            console.log( msg );
        } catch (e) {}

    };


    // Node, PhantomJS, etc
    // eg.  var CSV = require("CSV"); CSV.parse(...);
    if ( typeof module != 'undefined' && module.exports) {
        module.exports = CSV;
    }

    // CommonJS http://wiki.commonjs.org/wiki/Modules
    // eg.  var CSV = require("CSV").CSV; CSV.parse(...);
    else if (typeof exports != 'undefined' ) {
        exports.CSV = CSV;
    }

    // AMD https://github.com/amdjs/amdjs-api/wiki/AMD
    // eg.  require(['./csv.js'], function (CSV) { CSV.parse(...); } );
    else if (typeof define == 'function' && typeof define.amd == 'object'){
        define([], function () {
            return CSV;
        });
    }

    // standard js global
    // eg. CSV.parse(...);
    else if( global ){
        global.CSV = CSV;
    }

})(this);
