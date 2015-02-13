'use strict';

/*
var http = require('http');
var fs = require('fs');

var ws = new Writable();

ws._write = function(chunk, enc, next) {
    console.dir(chunk);
    next();
};

ws.on('end', function() {
   console.dir(arguments);
});

var server2 = http.createServer(function (req, res) {
    var stream = fs.createReadStream(__dirname + '/gulpfile.js');
    stream.pipe(ws);
    stream.pipe(res);

});

server2.listen(8001);
*/

/*
//기본 스트림 테스트
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var src = new Readable();
var dest = new Writable();

src._read = function(){
    src.push('1');
    src.push('2');
    src.push('3');
    src.push('4');
    src.push('5');
    src.push(null);
};

dest._write = function(chunk, enc, next){
    console.log(chunk.toString());
    next();
};

src.pipe(dest);
*/

//기본 스트림 테스트
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Transform = require('stream').Transform;
var src = new Readable();
var thru = new Transform();
var dest = new Writable();

src._read = function(){
};

thru._write = function(chunk, enc, next) {
    //this.emit('data', chunk.toString() + ' processed');
    console.log("writed");
    next();
};

thru._read = function() {
    console.log("readed");
};

thru._transform = function() {
    console.log("transform");
};

dest._write = function(chunk, enc, next){
    console.log(chunk.toString());
    next();
};

src.pipe(thru);
src.pipe(dest);


var c = 64;
var iv = setInterval(function () {
    if (++c >= 75) {
        clearInterval(iv);
        src.emit('end');
    }
    else src.emit('data', String.fromCharCode(c));
}, 100);
