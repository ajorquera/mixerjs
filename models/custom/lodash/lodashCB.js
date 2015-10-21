var Q,
fs,
exec,
errors,
exports,
bowerDefault,
verifyCategorys,
verifyExports,
verifyInclude,
getCategory,
getExports,
getInclude,
getType,
getPlus,
getMinus,
validLodash;

Q = require('q');
fs = require('fs');
exec = require('child_process').exec;
errors = require('./errors');
exports = module.exports = {};


bowerDefault = {
    'name': 'loadash',
    'version': 'custom',
    'main': 'lodash.custom.js'
};

verifyCategorys = function(categorys) {
    var err;
	
    err = categorys.every(function (val, index) {
        return (val === 'array' || val === 'chain' || val === 'collection' || val === 'date' ||
                val === 'function' || val === 'lang' || val === 'object' || val === 'number' || 
                val === 'string' || val === 'utility');
    });

    return  err;
}

verifyExports = function(exp) {
    var err;

    err = exp.every(function (val, index) {
        return (val === 'amd' || val === 'commonjs' || val === 'global' || val === 'iojs' ||
            val === 'node' || val === 'none' || val === 'umd');
    });

    return  err;
}

// verifyInclude = function(inc) {
//     var err;

//     err = inc.every(function (val, index) {
//         return (val === 'each' || val === 'filter' || val === 'map');
//     });

//     return  err;
// }

getCategory = function(categorys) {
    var resp,
    categoryList;

    resp = {};

    if(typeof categorys !== 'undefined') {

        if(categorys.length > 0) {

            if (!verifyCategorys(categorys)) {
                resp.string = null;
                resp.success = true;
                resp.errMsg = 'LODASH_CATEGORYNOTMATCH';
                return resp;
            } 

            categoryList = categorys.join(',');

            resp.string = 'category=' + categoryList;
            resp.success = true;
            resp.errMsg = null;

            return resp;
        }else {
            resp.string = null;
            resp.success = true;
            resp.errMsg = 'LODASH_EMPTYCATEGORY';

            return resp;
        }

    }else {
        resp.string = null;
        resp.success = false;
        resp.errMsg = null;

        return resp;
    }

}

getExports = function(exp) {
    var resp,
    exportsList;

    resp = {};

    if(typeof exp !== 'undefined') {

        if(exp.length > 0) {

            if (!verifyExports(exp)) {
                resp.string = null;
                resp.success = true;
                resp.errMsg = 'LODASH_EXPORTSNOTMATCH';
                return resp;
            } 

            exportsList = exp.join(',');

            resp.string = 'exports=' + exportsList;
            resp.success = true;
            resp.errMsg = null;

            return resp;
        }else {
            resp.string = null;
            resp.success = true;
            resp.errMsg = 'LODASH_EMPTYEXPORTS';
            return resp;
        }
    }else {
        resp.string = null;
        resp.success = false;
        resp.errMsg = null;

        return resp;
    }

}

getInclude = function(inc) {
    var resp,
    includeList;
    resp = {};

    if(typeof inc !== 'undefined') {

        if(inc.length > 0) {

            // if (!verifyInclude(inc)) {
            //     resp.string = null;
            //     resp.success = true;
            //     resp.errMsg = 'LODASH_INCLUDENOTMATCH';
            //     return resp;
            // } 

            includeList = inc.join(',');

            resp.string = 'include=' + includeList;
            resp.success = true;
            resp.errMsg = null;

            return resp;
        }else{
            resp.string = null;
            resp.success = true;
            resp.errMsg = 'LODASH_EMPTYINCLUDE';
            return resp;
        }

    }else {
        resp.string = null;
        resp.success = false;
        resp.errMsg = null;

        return resp;
    }

}

getType = function(type) {
    var resp;

    resp = {};

    if(typeof type !== 'undefined') {

        switch(type) {
            case 'strict':
                resp.string = type;
                resp.success = true;
                resp.errMsg = null;
            break;
            case 'compat':
                resp.string = type;
                resp.success = true;
                resp.errMsg = null;
            break;
            case 'modern':
                resp.string = type;
                resp.success = true;
                resp.errMsg = null;
            break;
            default:
                resp.string = null;
                resp.success = true;
                resp.errMsg = 'LODASH_TYPENOTMATCH';
        }

        return resp;

    }else {
        resp.string = null;
        resp.success = false;
        resp.errMsg = null
        return resp;
    }

}

getPlus = function(plus) {
    var resp,
    plusList;

    resp = {};

    if(typeof plus !== 'undefined') {
        if(plus.length > 0) {
            plusList = plus.join(',');

            resp.string = 'plus=' + plusList;
            resp.success = true;
            resp.errMsg = null;

            return resp;
        }else {
            resp.string = null;
            resp.success = true;
            resp.errMsg = 'LODASH_EMPTYPLUS';
            return resp;
        }

    }else {
        resp.string = null;
        resp.success = false;
        return resp;
    }

}

getMinus = function(minus) {
    var resp,
    minusList;

    resp = {};

    if(typeof minus !== 'undefined') {

        if(minus.length > 0) {
            minusList = minus.join(',');

            resp.string = 'minus=' + minusList;
            resp.success = true;
            resp.errMsg = null;

            return resp

        }else {
            resp.string = null;
            resp.success = true;
            resp.errMsg = 'LODASH_EMPTYMINUS';

            return resp;
        }

    }else {
        resp.string = null;
        resp.success = false;
        resp.errMsg = null;
        return resp;
    }

}

isValidLodash = function(obj) {
    var count,
    err,
    validQuerysKey;

    count = Object.keys(obj).length;
    validQuerysKey = ['type', 'category', 'plus', 'minus', 'include', 'exports'];

    if(count > 0) {
        err = Object.keys(obj).every(function (val, index) {
            var i;
            for (i = 0; i <= validQuerysKey.length; i++) {
                if(val === validQuerysKey[i]) {
                    return true;
                }
            }
            //return (val === 'type' || val === 'category' || val === 'plus' || val === 'minus' || val === 'include' || val === 'exports');
        });
    }else {
        err = true;
    }

    return err;
}

exports.install = function(f, obj) {
    var child,
    err,
    deferred;

    deferred = Q.defer();

    if(isValidLodash(obj)) {

        exec('mkdir -p bower_components/lodash#custom', function (err, stdout, stderr) {
            var child,
            category,
            type,
            plus,
            minus,
            include,
            exp,
            build;

            if (err) {
                console.log('child processes failed with error code: ' + err.code);
                deferred.reject(errors.manageErrors('LODASH_INVALIDARGUMENT'));
            }

            fs.writeFileSync('bower_components/lodash#custom/.bower.json', JSON.stringify(bowerDefault));

            type = getType(obj.type);
            category = getCategory(obj.category);
            plus = getPlus(obj.plus);
            minus = getMinus(obj.minus);
            include = getInclude(obj.include);
            exp = getExports(obj.exports);

            build = '';

            if (type.string) {
                build += type.string + ' ';

            } else if(type.success) deferred.reject(errors.manageErrors(type.errMsg));
			

            if (category.string) {
                build += category.string + ' ';

            } else if(category.success) deferred.reject(errors.manageErrors(category.errMsg));
			

            if (plus.string) {
                build += plus.string + ' ';

            } else if(plus.success) deferred.reject(errors.manageErrors(plus.errMsg));

            if (minus.string) {
                build += minus.string + ' ';

            } else if(minus.success) deferred.reject(errors.manageErrors(minus.errMsg));
            

            if (include.string) {
                build += include.string + ' ';

            } else if(include.success) deferred.reject(errors.manageErrors(include.errMsg));
                
            if (exp.string) {
                build += exp.string + ' ';

            } else if(exp.string) deferred.reject(errors.manageErrors(exp.errMsg));
                
            if(build !== '') {
                exec('node_modules/lodash-cli/bin/lodash ' + build, function (err, stdout, stderr) {
                    var child;

                    if (err) {
                        console.log('child processes failed with error code: ' + err.code);
                        deferred.reject(errors.manageErrors('LODASH_INVALIDARGUMENT'));
                    }
				    
                    build = '';

                    child = exec('rm lodash.custom.min.js && mv lodash.custom.js bower_components/lodash#custom/');
                    child.stdout.on('end', function() {
                        deferred.resolve(true);
                    });
                });
				
            }else {
                deferred.reject(errors.manageErrors('LODASH_EMPTYMODULES'));
            }
			
        });
    }else {
        deferred.reject(errors.manageErrors('LODASH_PARAMBAD'));
    }

    return deferred.promise; 
}
