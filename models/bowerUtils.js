var BowerLibrary,
    bowerUtils,
    NodeCache,
    helpers,
	bower,
    fs,
    q;

bower        = require('bower');
NodeCache    = require('node-cache');
helpers      = require('./helpers');
q            = require('q');
fs           = require('fs-extra');
BowerLibrary = require('./BowerLibrary');


//Utility singleton to manage bower libraries.
bowerUtils   = {

    /**
     * @description Get a library information through bower
     * @param {object| Array} library - Library or array of libraries
     * return {promise}
     */
    getLibrary: function(library) {
        var promise,
            promises;

        //one library
        if(library.length === undefined) {

            promise = _fetchLibraryInfo(library.name, library.version);

        //array libraries
        } else {
            promises = [];
            library.forEach(function(library) {
                promises.push(_fetchLibraryInfo(library.name, library.version));
            });

            promise = q.all(promises);
        }

        return promise;
    },

    /**
     * @description Downloads libraries to the file system using bower.
     * @param {object} libraries - Array containing libraries objects. library.name and library.version
     * @returns {promise}
     */
    downloadLibraries: function(libraries) {
        var deferred;

        deferred = q.defer();

        this.getAndResolveLibraryDependencies(libraries).then(function(dependencies) {

            _downloadWithBower(_filterDependencies(dependencies))
                .then(function() {
                    deferred.resolve();
                })
                .catch(function(response) {
                    deferred.reject(response);
                });

        }).catch(function(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    },

    /**
     * @description Gets an array for all the libraries and resolves it's dependencies. Example, for toastr it should
     *              return [jquery, toastr]
     * @param libraries - Array of libraries object. Library.name and library.version.
     * @returns {promise}
     */
    getAndResolveLibraryDependencies: function (libraries) {
        var deferred;

        deferred = q.defer();


        _getDependencyLevels.call(this, libraries.reverse()).then(function(dependencyLevels) {

            q.all(helpers.flatten(dependencyLevels, true)).then(function(libraries) {
                libraries = helpers.flatten(libraries, true);
                libraries = helpers.uniq(libraries.reverse(), 'name');

                deferred.resolve(libraries);

            }).catch(function(response) {
                deferred.reject(response);
            });

        }).catch(function(response) {
            deferred.reject(response);
        });

        return deferred.promise;
    }
};

module.exports = bowerUtils;

/***********************************************************************************************************************
                                        PRIVATE
***********************************************************************************************************************/

//filter installed libraries
function _filterDependencies(dependencies) {
    var filteredDependencies;

    filteredDependencies = [];
    dependencies.forEach(function(library) {
        if(library.isInstalled() === false) {
            filteredDependencies.push(library);
        }
    });

    return filteredDependencies;
}

function _downloadWithBower(dependencies) {
    var deferred,
        bowerFormatLibraries;

    deferred = q.defer();

    if(dependencies.length === 0) {
        deferred.resolve();
        return deferred.promise;
    }

    bowerFormatLibraries = dependencies.map(function(library) {
        return library.toString();
    });

    //installs library locally
    bower.commands.install(bowerFormatLibraries).on('end', function (results) {
        dependencies.forEach(function(library) {
            library.renameBowerLibrary(library.toString());
        });

        deferred.resolve();

    }).on('error', _downloadWithBower.errorHandler.bind({}, deferred));

    return deferred.promise;
}

_downloadWithBower.errorHandler = function(deferred, err) {
    var errorObject;

    if(err.code === 'ENOTFOUND') {
        errorObject = {name: 'NOT_FOUND', params: {library: err.data.endpoint.source}};

    } else if(err.code === 'ECONFLICT') {
        errorObject = {name: 'CONFLICT', message: err.message};

    } else if (err.code === 'ENORESTARGET') {
        errorObject = {name: 'WRONG_VERSION', params : {library: err.data.endpoint.source, details: err.details}};

    } else if(err) {
        errorObject = {name: 'UNKNOWN'};
    }

    deferred.reject(errorObject);
};

function _fetchLibraryInfo(name, version) {
    var promise,
        deferred,
        bowerLibraryName;

    bowerLibraryName = _fetchLibraryInfo.createLibraryIndex(name, version);

    promise = _fetchLibraryInfo.cache.get(bowerLibraryName);

    if(promise === undefined) {

        deferred = q.defer();

        bower.commands.info(bowerLibraryName).on('end', function (library) {

            //Check if is latest version
            library = library.latest ? library.latest : library;

            //the name of some libraries doesn't match
            if(library.name !== name) {
                library.alias = name;
            }

            deferred.resolve(new BowerLibrary(library));

        }).on('error', _fetchLibraryInfo.errorHandler.bind({}, deferred, name));

        promise = deferred.promise;

        //cache all bower request
        _fetchLibraryInfo.cache.set(bowerLibraryName, promise);
    }

    return promise;
}

_fetchLibraryInfo.cache = new NodeCache({checkPeriod: 86400, useClones: false});


_fetchLibraryInfo.createLibraryIndex = function(name, version) {
    return name + (version ? '#' + version : '');
};

_fetchLibraryInfo.errorHandler = function(deferred, name, err) {
    var errorObject;

    if(err.code === "ECONFLICT") {
        errorObject = {name: 'NOT_FOUND', params: {library: name}};

    } else if (err.code === "ENORESTARGET") {
        errorObject = {name: 'WRONG_VERSION', params: {library: name, details: err.details}};

    } else if(err.code === "ENOTFOUND") {
        errorObject = {name: 'NOT_FOUND', params: {library: name}};

    } else if(err) {
        errorObject = {name: 'UNKNOWN'};
    }

    deferred.reject(errorObject);
};

//TODO need to clean this function
//recursive function
function _getDependencyLevels(libraries, levels, currentLevel, counterLeft, deferred) {
    var promise,
        _this;

    _this = this;
    levels               = levels || [];
    deferred             = deferred || q.defer();
    currentLevel         = currentLevel || 0;
    counterLeft          = counterLeft || {count: 1};
    levels[currentLevel] = levels[currentLevel] || [];

    //get library information
    promise = bowerUtils.getLibrary(libraries);
    levels[currentLevel].push(promise);

    promise.then(function(libraries) {

        libraries.forEach(function(library) {
            if(library.dependencies !== undefined) {
                _getDependencyLevels.call(_this, library.dependencies, levels, currentLevel + 1, counterLeft, deferred);
                counterLeft.count += 1;
            }
        });

        counterLeft.count -= 1;

        if(counterLeft.count === 0) deferred.resolve(levels);
    }).catch(function(response) {
        deferred.reject(response)
    });

    return deferred.promise;
}