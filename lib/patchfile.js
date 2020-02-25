'use strict';

const {
    lstat,
    readFile,
    writeFile,
} = require('fs').promises;

const check = require('checkup');
const diff = require('daffy');

const ERROR_MSG = 'File is to big. ' +
                'Could not patch files ' +
                'bigger then ';

module.exports = async (name, patch, options = {}) => {
    check
        .type('name', name, 'string')
        .type('patch', patch, 'string');
    
    const {size} = await lstat(name);
    
    if (isNaN(options.size) || size < options.size)
        return patchFile(name, patch);
    
    throw Error(ERROR_MSG + options.size);
};

async function patchFile(name, patch) {
    const data = await readFile(name, 'utf8');
    const diffResult = diff.applyPatch(data, patch);
    
    return writeFile(name, diffResult);
}

