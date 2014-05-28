var eachline = require('../').eachline;

eachline(process.stdin, function(line, index) {
  return '[' + index + '] <' + line + '>';
}, function(result) {
  console.log(result);
});
