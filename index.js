/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;

/**
 * Expose `Queue`.
 */

module.exports = Queue;

/**
 * Create a FIFO queue.
 *
 * @api public
 */

function Queue(){
  this.buf = [];
  this.fns = [];
  this.max(Infinity);
  this.events = new Emitter;
  this.push = this.push.bind(this);
}

/**
 * Push `data` onto the queue. Bound to `queue`.
 *
 * @param {Mixed} data
 * @api public
 */

Queue.prototype.push = function(data){
  if (this.fns.length) return this.fns.shift()(data);
  if (this.buf.length == this._max) return this.events.emit('overflow', data);
  this.buf.push(data);
};

/**
 * Get the next piece of data.
 *
 * @return {Function}
 * @api public
 */

Queue.prototype.next = function(){
  var self = this;
  return new Promise(function(resolve){
    if (self.buf.length) return resolve(self.buf.shift());
    self.fns.push(resolve);
  });
};

/**
 * Set the maximum buffer size.
 *
 * @param {Number} max
 * @return {Queue}
 * @api public
 */

Queue.prototype.max = function(max){
  this._max = max;
  if (this.buf.length > max) this.buf.length = max;
  return this;
};
