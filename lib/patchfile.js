'use strict';

const fs = require('fs');
const {promisify} = require('util');

const check = require('checkup');
const diff = require('daffy');
const tryCatch = require('try-catch');

const lstat = promisify(fs.lstat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const ERROR_MSG = 'File is to big. '          +
                'Could not patch files '    +
                'bigger then ';

module.exports = async (name, patch, options = {}) => {
    check
        .type('name', name, 'string')
        .type('patch', patch, 'string')
    
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

