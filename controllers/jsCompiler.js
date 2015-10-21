var bowerUtils,
    jsCompiler,
    UglifyJS,
    url,
    q;

bowerUtils = require('../models/bowerUtils');
url        = require('url');
q          = require('q');
shell      = require('shelljs');
UglifyJS   = require("uglify-js");
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

jsCompiler = function(req, res, next) {
    url = url.parse(req.url, true);

    _checkForValidQuery(url.query);

    _installLibraries(url.query)
        .then(function() {
            _createFile(url.query).then(function(response) {

                if(url.pathname.indexOf('.min.js') !== -1) {
                    response = _minifyString(response);
                }

                res.send(response);
            }).catch(function(response) {
                next(response);
            });
        })
        .catch(function(response) {
            next(response);
        });
};

function _createFile(libraries) {
    var arrayLibraries,
        deferred;

    deferred = q.defer();
    arrayLibraries = [];
    Object.keys(libraries).forEach(function(libraryName) {
        arrayLibraries.push({
            name    : libraryName,
            version : libraries[libraryName]
        })
    });

    bowerUtils.getAndResolveLibraryDependencies(arrayLibraries).then(function(response) {
        var filesToConcatenate;

        filesToConcatenate = [];
        response.forEach(function(library) {
            var filePath;

            try {
                filePath = library.getFilePath();
            } catch(e) {
                deferred.reject(e);
                return;
            }

            filesToConcatenate.push(filePath);
        });

        deferred.resolve(shell.cat(filesToConcatenate));

    });

    return deferred.promise;
}

function _checkForValidQuery(query) {
    var element,
        count;

    count = 0;

    //check duplicated libraries
    for (element in query) {
        count += 1;

        if(Array.isArray(query[element])) {
            throw {name: 'DUPLICATED', params: {library: element}};
        }
    }

    //check for supplied parameters
    if(count === 0) {
        throw {name: 'NO_PARAMS'};
    }
}


function _installLibraries(libraries) {
    var arrayLibraries;

    arrayLibraries = [];
    Object.keys(libraries).forEach(function(libraryName) {
        arrayLibraries.push({
            name    : libraryName,
            version : libraries[libraryName]
        })
    });

    return bowerUtils.downloadLibraries(arrayLibraries);
}

function _minifyString(str) {
    str = jsp.parse(str);
    str = pro.ast_squeeze(str);


    return pro.gen_code(str);;
}

module.exports = jsCompiler;