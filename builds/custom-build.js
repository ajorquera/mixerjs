var Q,
fs,
exec,
jqueryCB,
lodashCB,
exports;

Q = require('q');
fs = require('fs');
exec = require('child_process').exec;
jqueryCB = require('./libraries/jquery/jqueryCB');
lodashCB = require('./libraries/lodash/lodashCB');

exports = module.exports = {};

exports.customBuild = function(f, obj) {
    var child,
    deferred;
    deferred = Q.defer();

    switch(f) {
        case 'jquery':
            jqueryCB.install(f, obj)
                .then(function() {
                    deferred.resolve(true);
                }, function(err) {
                    deferred.reject(err);
                });
        break;
        case 'lodash':
            lodashCB.install(f, obj)
                .then(function() {
                    deferred.resolve(true);
                }, function(err) {
                    deferred.reject(err);
                });
        break;
        default:
            deferred.reject('error');
    }

    return  deferred.promise;
}
