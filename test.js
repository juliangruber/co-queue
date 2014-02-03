var Queue = require('./');
var co = require('co');
var assert = require('assert');
var equal = assert.equal;
var wait = require('co-wait');
var Emitter = require('events').EventEmitter;
var Readable = require('stream').Readable;

describe('Queue', function(){
  describe('push() / next()', function(){
    it('should queue', function(done){
      var queue = new Queue;
      queue.push('foo');
      queue.push('bar');
      queue.push('baz');
      
      co(function*(){
        equal(yield queue.next(), 'foo');
        equal(yield queue.next(), 'bar');
        equal(yield queue.next(), 'baz');
      })(done);
    });
    
    it('should forward', function(done){
      var queue = new Queue;
      
      co(function*(){
        equal(yield queue.next(), 'foo');
        equal(yield queue.next(), 'bar');
        equal(yield queue.next(), 'baz');
      })(done);
      
      co(function*(){
        yield wait();
        queue.push('foo');
        yield wait();
        queue.push('bar');
        yield wait();
        queue.push('baz');
      })();
    });
    
    it('should load balance', function(done){
      var queue = new Queue;
      
      co(function*(){
        equal(yield queue.next(), 'foo');
        equal(yield queue.next(), 'baz');
      })();
      
      co(function*(){
        equal(yield queue.next(), 'bar');
        equal(yield queue.next(), 'end');
      })();
      
      co(function*(){
        yield wait();
        queue.push('foo');
        yield wait();
        queue.push('bar');
        yield wait();
        queue.push('baz');
        yield wait();
        queue.push('end');
        yield wait();
      })(done);
    });
    
    it('should be bound', function(done){
      var queue = new Queue;
      var emitter = new Emitter;
      emitter.on('data', queue.push);
      
      co(function*(){
        equal(yield queue.next(), 'foo');
        equal(yield queue.next(), 'bar');
        equal(yield queue.next(), 'baz');
      })(done);
      
      emitter.emit('data', 'foo');
      emitter.emit('data', 'bar');
      emitter.emit('data', 'baz');
    });
  });
  
  describe('max()', function(){
    it('should drop data', function(done){
      var queue = new Queue;
      queue.max(1);
      
      queue.push('foo');
      queue.push('bar');
      queue.push('baz');
      
      co(function*(){
        equal(yield queue.next(), 'foo');
        queue.push('end');
        equal(yield queue.next(), 'end');
      })(done);
    });
    
    it('should cause the overlow event', function(done){
      var queue = new Queue;
      queue.max(1);
      queue.events.on('overflow', function(data){
        equal(data, 'bar');
        done();
      });
      
      queue.push('foo');
      queue.push('bar');
    });
  });
});
