var bowerUtils,
    jsCompiler,
    helpers,
    shelljs,
    url,
    jsp,
    pro,
    q;

bowerUtils = require('../models/bowerUtils');
helpers    = require('../models/helpers');
jsp        = require("uglify-js").parser;
pro        = require("uglify-js").uglify;
shelljs    = require('shelljs');
urlParser  = require('url');
q          = require('q');

jsCompiler = function(req, res, next) {
    var url;

    res.contentType('application/json');

    url = urlParser.parse(req.url, true);

    _validateUrl(url);

    _installLibraries(url.query).then(function() {

        _createFile(url.query).then(function(response) {

            if(url.pathname.indexOf('.min.js') !== -1) {
                response = _minifyString(response);
            }

            res.send(response);

        }).catch(function(response) {
            next(response);
        });

    }).catch(function(response) {
            next(response);
    });
};

//----------------------------------------PRIVATE-----------------------------------------------------------------------

function _validateUrl(url) {
    _checkForValidPath(url.pathname);
    _checkForValidQuery(url.query);
}

function _createFile(libraries) {
    var arrayLibraries,
        deferred;

    deferred = q.defer();

    arrayLibraries = _convertLibrariesToArray(libraries);

    bowerUtils.getAndResolveLibraryDependencies(arrayLibraries).then(function(libraries) {
        try {
            deferred.resolve(_concatenateLibraries(libraries));
        } catch(error) {
            deferred.reject(error);
        }
    });

    return deferred.promise;
}

function _checkForValidQuery(query) {
    var element;

    //check duplicated libraries
    for (element in query) {
        if(Array.isArray(query[element])) {
            throw {name: 'DUPLICATED', params: {library: element}};
        }
    }

    //check for supplied parameters
    if(helpers.size(query) === 0) {
        throw {name: 'NO_PARAMS'};
    }
}

function _checkForValidPath(path) {
    if(path.indexOf('.js') === -1) {
        throw {name: 'INVALID_PATH'}
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

function _convertLibrariesToArray(libraries) {
    var arrayLibraries;

    arrayLibraries = [];
    Object.keys(libraries).forEach(function(libraryName) {
        arrayLibraries.push({
            name    : libraryName,
            version : libraries[libraryName]
        })
    });

    return arrayLibraries;
}

function _concatenateLibraries(libraries) {
    var filesToConcatenate;

    filesToConcatenate = [];
    libraries.forEach(function(library) {
        var filePath;

        filePath = library.getFilePath();

        filePath && filesToConcatenate.push(filePath);
    });

    return shelljs.cat(filesToConcatenate);
}

function _minifyString(str) {
    str = jsp.parse(str);
    str = pro.ast_squeeze(str);

    return pro.gen_code(str);
}

module.exports = jsCompiler;