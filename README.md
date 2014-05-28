# stream-eachline [![Build Status](https://secure.travis-ci.org/cowboy/node-stream-eachline.png?branch=master)](http://travis-ci.org/cowboy/node-stream-eachline)

Like readline or split, but behaves more like ruby's `.each_with_index` method when streams lack trailing newlines.

## Getting Started
Install the module with: `npm install stream-eachline`

```javascript
var eachline = require('stream-eachline').eachline;

// Modify each line in process.stdin input stream (while streaming)
// and when done log an array of modified lines.
eachline(process.stdin, function(line, index) {
  return '[' + index + '] ' + line.toUpperCase();
}, function(lines) {
  console.log('Array of modified lines:', lines);
});

// The following examples all do the same thing:
eachline(process.stdin, function(line, index) {
  return line;
}, function(lines) {
  doSomethingWithLines(lines);
});

// You may omit lineFunction if you don't need to modify the streamed lines.
eachline(process.stdin, doSomethingWithLines);

// You may omit instream if you want to process process.stdin's lines.
eachline(doSomethingWithLines);
```

## Documentation

`eachline([instream], [lineFunction], doneFunction)`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 "Cowboy" Ben Alman  
Licensed under the MIT license.
