import {Readable} from 'node:stream';
import {
    read,
    write,
    readStat,
} from 'redzip';
import pullout from 'pullout';
import check from 'checkup';
import diff from 'daffy';

const ERROR_MSG = 'File is to big. ' +
    'Could not patch files ' +
    'bigger then ';

export async function patchfile(name, patch, options = {}) {
    check
        .type('name', name, 'string')
        .type('patch', patch, 'string');
    
    const {size} = await readStat(name);
    
    if (isNaN(options.size) || size < options.size)
        return await patchFile(name, patch);
    
    throw Error(ERROR_MSG + options.size);
}

async function patchFile(name, patch) {
    const stream = await read(name);
    const data = await pullout(stream);
    
    const diffResult = diff.applyPatch(data, patch);
    
    return write(name, Readable.from(diffResult));
}
