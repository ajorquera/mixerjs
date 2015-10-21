var Q,
fs,
exec,
exports,
bowerDefault,
isValidJquery,
errors,
isEmptyParameter;

Q = require('q');
fs = require('fs');
exec = require('child_process').exec;
errors = require('./errors');

exports = module.exports = {};

bowerDefault = {
	'name': 'jquery',
	'version': 'custom',
	'main': 'jquery-custom.js'
};

isValidJquery = function(obj) {
    var count,
    err;

    count = Object.keys(obj).length;

    if(count > 0) {
        err = Object.keys(obj).every(function (val, index) {
            return (val === 'exclude' || val === 'version');
        });
    }else {
        err = true;
    }

    return err;
}

isEmptyParameter = function(param) {
    var result,
    i,
    len;

    if(param instanceof Array) {
        for (i=0, len = param.length; i <= len; i++) {
            if (param[i] !== '') {
                return false
            }else {
                return true
            }
        }
    }

    if(typeof param === 'string' && param !== '') {
        return false;
    }else {
        return true;
    }

}

exports.install = function(f, obj) {
    var child,
    deferred;

    deferred = Q.defer();

    if(isValidJquery(obj)) {
        child = exec('mkdir -p bower_components/jquery#custom');

        child.stdout.on('end', function() {
            var child,
            exclude,
            build;

            fs.writeFileSync('bower_components/jquery#custom/.bower.json', JSON.stringify(bowerDefault));

            if(typeof obj.exclude !== 'undefined' && typeof obj.version !== 'undefined') {

                if(isEmptyParameter(obj.version)) {
                    deferred.reject(errors.manageErrors('JQUERY_VERSIONBAD'));
                }

                if(isEmptyParameter(obj.exclude)) {
                    deferred.reject(errors.manageErrors('JQUERY_EMPTYEXCLUDE'));
                }

                if(obj.exclude.length > 0) {
                    exclude = obj.exclude.join(',');
                    build = 'node_modules/jquery-builder/bin/builder.js -v ' + obj.version + ' --exclude ' + exclude;
                    child = exec(build, function(err, stdout, stderr) {

                        if (stdout === 'Not Found') {
                            deferred.reject(errors.manageErrors('JQUERY_PARAMBAD'));
                        }else {
                            fs.writeFileSync('bower_components/jquery#custom/jquery-custom.js', stdout);
                            deferred.resolve(true);
                        }

                    });
                }else{
                    deferred.reject(errors.manageErrors('JQUERY_EMPTYEXCLUDE'));
                }

            }else {
                deferred.reject(errors.manageErrors('JQUERY_PARAMBAD'));
            }
        });

    }else {
        deferred.reject(errors.manageErrors('JQUERY_PARAMBAD'));
    }

    return  deferred.promise;
};
