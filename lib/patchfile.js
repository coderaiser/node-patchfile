(function() {
    'use strict';
    
    var fs          = require('fs'),
        
        check       = require('checkup'),
        diff        = require('daffy'),
        flop        = require('flop'),
        tryCatch    = require('try-catch'),
        
        ERROR_MSG   = 'File is to big. '          +
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
        
        flop.read(name, 'size raw', function(error, size) {
            if (!error)
                if (isNaN(options.size) || size < options.size)
                    patchFile(name, patch, callback);
                else
                    error = {
                        message: ERROR_MSG + options.size
                    };
            
            if (error)
                callback(error);
        });
    };
    
    function patchFile(name, patch, callback) {
        fs.readFile(name, 'utf8', function read(error, data) {
            var diffResult;
            
            if (error) {
                callback(error);
            } else {
                error   = tryCatch(function() {
                    diffResult = diff.applyPatch(data, patch);
                });
                
                if (error)
                    callback(error);
                else
                    fs.writeFile(name, diffResult, callback);
            }
        });
    }
})();
