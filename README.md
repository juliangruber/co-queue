
# co-queue

  A FIFO queue for co.
  
  [![build status](https://secure.travis-ci.org/segmentio/co-queue.png)](http://travis-ci.org/segmentio/co-queue)

## Example

  Create a queue with one producer and two consumers doing fake work:

```js
var Queue = require('co-queue');
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
```

The output is:

```bash
$ make example
consumer 1: 0.4872316620312631
consumer 2: 0.8702194727957249
consumer 1: 0.200025983620435
consumer 2: 0.14811497158370912
consumer 2: 0.6677501150406897
consumer 1: 0.5147413061931729
consumer 2: 0.6373226766008884
consumer 1: 0.5006165818776935
consumer 2: 0.15247466461732984
consumer 2: 0.9118324755690992
^C
```

## Installation

  You need to run node `0.11.x` or higher and add the `--harmony` flag.

```bash
$ npm install co-queue
```

## API

### Queue()

  Create a new FIFO queue.

### Queue#push(data)

  Push `data` onto the queue.
  
  `Queue#push` is bound to the queue, so hooking into existing libraries is easy:
  
```js
emitter.on('data', queue.push);
stream.on('data', queue.push);
fn(queue.push);
```

### Queue#next()

  Get the next piece of data.

### Queue#max(max)

  Set the maximum buffer size. When reached, new data will be dropped.

### Queue#events.on('overflow', fn)

  The `overflow` event will be emitted whenever data is dropped, which will be passed to `fn` as first argument.

## License

  MIT

