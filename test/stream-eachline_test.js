'use strict';

var eachline = require('../lib/stream-eachline.js').eachline;
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

// Convert a line to a string like: [i] <line of text>
function modifyLine(line, index) {
  return '[' + index + '] <' + line + '>';
}

// Self-explanatory?
function getFixtureStream(name) {
  return fs.createReadStream('test/fixtures/' + name);
}
function getFixtureExpected(name) {
  var str = fs.readFileSync('test/fixtures/expected/' + name, 'utf8');
  return str.split('\n').slice(0, -1);
}

// This is probably the worst idea ever.
var fakeStdinStream;
Object.defineProperty(process, 'stdin', {
  get: function() {
    return fakeStdinStream;
  },
});

exports['eachline args'] = {
  setUp: function(done) {
    fakeStdinStream = getFixtureStream('2-line-1-linebreaks');
    done();
  },
  'all arguments': function(test) {
    test.expect(1);
    eachline(process.stdin, String, function(actual) {
      test.deepEqual(actual, ['foo', 'bar']);
      test.done();
    }.bind(this));
  },
  'no lineFunction': function(test) {
    test.expect(1);
    eachline(process.stdin, function(actual) {
      test.deepEqual(actual, ['foo', 'bar']);
      test.done();
    }.bind(this));
  },
  'no instream': function(test) {
    test.expect(1);
    eachline(String, function(actual) {
      test.deepEqual(actual, ['foo', 'bar']);
      test.done();
    }.bind(this));
  },
  'no instream, no lineFunction': function(test) {
    test.expect(1);
    eachline(function(actual) {
      test.deepEqual(actual, ['foo', 'bar']);
      test.done();
    }.bind(this));
  },
};

exports['eachline'] = {};

// Create one test per fixture/expected file.
fs.readdirSync('test/fixtures').filter(function(filename) {
  return !fs.statSync('test/fixtures/' + filename).isDirectory();
}).forEach(function(name) {
  exports['eachline'][name] = function(test) {
    test.expect(1);
    eachline(
      // Read from this stream (file, not stdin, in this case).
      getFixtureStream(name),
      // Modify each line as it comes in.
      modifyLine,
      // When done processing input stream lines, assert that what's generated
      // matches the output generated by generate-fixtures.rb
      function(actual) {
        test.deepEqual(actual, getFixtureExpected(name));
        test.done();
      }
    );
  };
});
