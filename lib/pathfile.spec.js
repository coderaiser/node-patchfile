import {test} from 'supertape';
import {tryToCatch} from 'try-to-catch';
import {patchfile} from './patchfile.js';

test('patchfile: no name', async (t) => {
    const [e] = await tryToCatch(patchfile);
    
    t.equal(e.message, 'name should be string');
    t.end();
});

test('patchfile: no patch', async (t) => {
    const [e] = await tryToCatch(patchfile, 'hello');
    
    t.equal(e.message, 'patch should be string');
    t.end();
});

test('patchfile: no file', async (t) => {
    const [e] = await tryToCatch(patchfile, 'hello', 'world');
    
    t.equal(e.message, `ENOENT: no such file or directory, lstat 'hello'`);
    t.end();
});
