# Patchfile

Patch file with given diff.

## Install

```
npm i patchfile --save
```

## How to use?

```js
var daffy       = require('daffy'),
    patchfile   = require('patchfile'),
    patch       = daffy.createPatch('hello', 'hello world');

/* patch file thet not bigger then 2kb */

patchfile('hello.txt', patch, {size: 2048}, function(error) {
    if (error)
        console.error(error.message);
});
```

## License

MIT
