var Queue = require('./');
var co = require('co');
var wait = require('co-wait');

var queue = new Queue;

co(function*(){
  while (true) {
    console.log('consumer 1: %s', yield queue.next());
    yield wait(Math.random() * 1000);
  }
})();

co(function*(){
  while (true) {
    console.log('consumer 2: %s', yield queue.next());
    yield wait(Math.random() * 1000);
  }
})();

setInterval(function(){
  queue.push(Math.random());
}, 300);
