/*
 * stream-eachline
 * https://github.com/cowboy/node-stream-eachline
 *
 * Copyright (c) 2014 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 */

'use strict';

exports.eachline = function(stream, linefn, donefn) {
  if (typeof stream === 'function') {
    donefn = linefn;
    linefn = stream;
    stream = process.stdin;
  }
  if (typeof donefn === 'undefined') {
    donefn = linefn;
    linefn = String;
  }

  var result = [];
  var buffer = '';
  var index = 0;

  // Flush complete lines.
  function flushLines() {
    // If the buffer doesn't contain linebreaks, there's nothing to do.
    if (!/\n/.test(buffer)) { return; }
    // Get all but the last line.
    var lines = buffer.split('\n');
    // (Store the last line for later)
    buffer = lines.pop();
    // For each line, call linefn with the line and an index.
    lines.forEach(function(line) {
      result.push(linefn(line, index++));
    });
  }

  // Set encoding (should this be an option? is there a way to auto-detect?)
  stream.setEncoding('utf8');

  // Read the stream.
  stream.on('readable', function() {
    var chunk = stream.read();
    if (chunk === null) { return; }
    // Append the chunk to the buffer and flush complete lines.
    buffer += chunk;
    flushLines();
  });

  // The stream has ended.
  stream.on('end', function() {
    // If any text still exists in the buffer, add another linebreak. This is
    // the super-special magical bit that readline seems to ignore.
    if (buffer !== '') {
      buffer += '\n';
    }
    flushLines();
    // All done!
    donefn(result);
  });

  // Return the stream. Because, why not?
  return stream;
};


// I can't seem to get it to work with readline.

// var readline = require('readline');
// exports.eachline = function(stream, linefn, donefn) {
//   var result = [];
//   var index = 0;

//   return readline.createInterface({
//     input: stream,
//     output: process.stdout,
//     terminal: false,
//   }).on('line', function(line) {
//     result.push(linefn(line, index++));
//   }).on('close', function() {
//     donefn(result);
//   });
// };


// Or with split.

// var split = require('split');
// exports.eachline = function(stream, linefn, donefn) {
//   var result = [];
//   var index = 0;

//   return stream.pipe(split()).on('data', function(line) {
//     result.push(linefn(line, index++));
//   }).on('close', function() {
//     result.pop(); // not quite
//     donefn(result);
//   });
// };
