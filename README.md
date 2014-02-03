
# co-queue

  A FIFO queue for co.

## Example

  Create a queue with one producer and two consumers, where load will be evenly distributed:

```js
var Queue = require('co-queue');
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
}, 500);
```

The output is:

```bash
$ make example
consumer 1: 0.7542695235460997
consumer 2: 0.9973183961119503
consumer 1: 0.10852471622638404
consumer 2: 0.08832448674365878
consumer 1: 0.7233098871074617
consumer 2: 0.19350069551728666
consumer 1: 0.2699217761401087
consumer 2: 0.3614544642623514
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

### Queue#next()

  Get the next piece of data.

### Queue#max(max)

  Set the maximum buffer size. When reached, new data will be dropped.

### Queue#from(source[, arg])

  Feed `source` into the queue.

  Possible sources:

  - functions: `queue.from(fn)`
  - event emitters: `queue.from(emitter, event)`
  - streams: `queue.from(stream)`

### Queue#events.on('overflow', fn)

  The `overflow` event will be emitted whenever data is dropped, which will be passed to `fn` as first argument.

## License

  MIT

