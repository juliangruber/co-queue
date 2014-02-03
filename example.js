var Queue = require('./');
var co = require('co');

var queue = new Queue;

co(function*(){
  while (true) {
    console.log('consumer 1: %s', yield queue.next());
  }
})();

co(function*(){
  while (true) {
    console.log('consumer 2: %s', yield queue.next());
  }
})();

setInterval(function(){
  queue.push(Math.random());
}, 300);
