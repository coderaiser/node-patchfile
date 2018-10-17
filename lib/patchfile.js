'use strict';

const fs = require('fs');
const {promisify} = require('util');

const check = require('checkup');
const diff = require('daffy');
const tryCatch = require('try-catch');

const ERROR_MSG = 'File is to big. '          +
                'Could not patch files '    +
                'bigger then ';

module.exports = promisify((name, patch, options, callback) => {
    if (!callback) {
        callback    = options;
        options     = {};
    }
    
    check
        .type('name', name, 'string')
        .type('patch', patch, 'string')
        .type('callback', callback, 'function');
    
    fs.lstat(name, (error, stat) => {
        const {size} = stat;
        
        if (error)
            return callback(error);
        
        if (isNaN(options.size) || size < options.size)
            return patchFile(name, patch, callback);
        
        callback(Error(ERROR_MSG + options.size));
    });
});

function patchFile(name, patch, callback) {
    fs.readFile(name, 'utf8', (error, data) => {
        if (error)
            return callback(error);
        
        const [e, diffResult] = tryCatch(diff.applyPatch, data, patch);
        
        if (e)
            return callback(e);
        
        fs.writeFile(name, diffResult, callback);
    });
}

