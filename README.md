# Patchfile

Patch file with given diff.

## Install

```
npm i patchfile
```

## How to use?

```js
const daffy = require('daffy');
const patchfile = require('patchfile');
const patch = daffy.createPatch('hello', 'hello world');
const tryToCatch = require('try-to-catch');

/* patch file thet not bigger then 2kb */
const [e] = await tryToCatch(patchfile, 'hello.txt', patch, {size: 2048});
if (e)
    console.error(e.message);
```

## License

MIT
