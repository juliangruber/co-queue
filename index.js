
/**
 * Module dependencies.
 */

var Writable = require('stream').Writable;
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
}

/**
 * Push `data` onto the queue.
 *
 * @param {Mixed} data
 * @api public
 */

Queue.prototype.push = function(data){
  if (this.fns.length) return this.fns.shift()(null, data);
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
  return function(fn){
    if (self.buf.length) return fn(null, self.buf.shift());
    self.fns.push(fn);
  };
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

/**
 * Feed `source` into the queue.
 *
 * Possible sources:
 *
 *   - functions: `queue.from(fn)`
 *   - event emitters: `queue.from(emitter, event)`
 *   - streams: `queue.from(stream)`
 *
 * @param {Mixed} source
 * @param {Mixed=} arg
 * @return {Queue}
 * @api public
 */

Queue.prototype.source = function(source, arg) {
  if ('object' == typeof source && source.pipe) {
    return this.sourceStream(source);
  } else if ('object' == typeof source) {
    return this.sourceEmitter(source, arg);
  } else if ('function' == typeof source) {
    return this.sourceFunction(source);
  } else {
    throw new Error('unknown source');
  }
};

/**
 * Feed `fn` into the queue.
 *
 * @param {Function} fn
 * @return {Queue}
 * @api private
 */

Queue.prototype.sourceFunction = function(fn){
  var self = this;
  fn(function(data){
    self.push(data);
  });
};

/**
 * Feed `emitter`'s `event` into the queue.
 *
 * @param {EventEmitter} emitter
 * @param {String} event
 * @return {Queue}
 * @api private
 */

Queue.prototype.sourceEmitter = function(emitter, event){
  var self = this;
  emitter.on(event, function(data){
    self.push(data);
  });
  return self;
};

/**
 * Feed `stream` into the queue.
 *
 * @param {Stream} stream
 * @return {Queue}
 * @api private
 */

Queue.prototype.sourceStream = function(stream){
  var self = this;
  var writable = new Writable({ objectMode: true });
  writable._write = function(data, enc, done){
    self.push(data);
    done();
  };
  stream.pipe(writable);
  return self;
};
