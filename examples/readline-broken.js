var readline = require('readline');

function eachline(stream, linefn, donefn) {
  var result = [];
  var index = 0;

  return readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false,
  }).on('line', function(line) {
    result.push(linefn(line, index++));
  }).on('close', function() {
    donefn(result);
  });
}

eachline(process.stdin, function(line, index) {
  return '[' + index + '] <' + line + '>';
}, function(result) {
  console.log(result);
});
