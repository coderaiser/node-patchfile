'use strict';

var fs = require('fs');

var check = require('checkup');
var diff = require('daffy');
var tryCatch = require('try-catch');

var ERROR_MSG = 'File is to big. '          +
                'Could not patch files '    +
                'bigger then ';

module.exports = function(name, patch, options, callback) {
    if (!callback) {
        callback    = options;
        options     = {};
    }
    
    check
        .type('name', name, 'string')
        .type('patch', patch, 'string')
        .type('callback', callback, 'function');
    
    fs.lstat(name, function(error, stat) {
        var size = stat.size;
        
        if (error)
            return callback(error);
            
        if (isNaN(options.size) || size < options.size)
            return patchFile(name, patch, callback);
        
        callback(Error(ERROR_MSG + options.size));
    });
};

function patchFile(name, patch, callback) {
    fs.readFile(name, 'utf8', function read(error, data) {
        if (error)
            return callback(error);
            
        var diffResult;
        var e = tryCatch(function() {
            diffResult = diff.applyPatch(data, patch);
        });
        
        if (e)
            return callback(e);
        
        fs.writeFile(name, diffResult, callback);
    });
}

