var libraryFallback,
    helpers,
    url,
    fs;

libraryFallback = require('../libraryFallback.json');
helpers         = require('./helpers');
url             = require('url');
fs              = require('fs-extra');

//----------------------------------------------------------------------------------------------------------------------

/**
 * @description Bower library. Describes a full bower library
 * @param {object | string} arguments[0] - Object with properties describing the library or name of the library
 * @param {string}          arguments[1] - Version of the library
 * @class
 * @constructor
 */
BowerLibrary = function() {
    var lenArgs,
        args;

    args = arguments;
    lenArgs = args.length;

    if(lenArgs === 1) {
        helpers.extend(this, args[0]);

        _handleDependencies.call(this, args);

    } else if(lenArgs === 2) {
        this.name    = args[0];
        this.version = args[1];
    }
};

/**
 * @description Describes the library in a string showing it's name and version
 * @returns {string}
 */
BowerLibrary.prototype.toString = function() {
    return this.name + (this.version ? '#' + this.version : '').toLowerCase();
};

/**
 * @description Gets the path for the file library.
 * @returns {string}
 */
BowerLibrary.prototype.getFilePath = function() {
    var filePath;

    filePath = this.LIB_DIRECTORY + '/' + this.toString() + '/' + _getLibraryFile.call(this);

    if (fs.existsSync(filePath) === false) {
        filePath = this.LIB_DIRECTORY + '/' + _getAlternateFilePath(this);

        if (fs.existsSync(filePath) === false && !this.main) {
            throw {name: 'INVALID_FILEPATH', params: {name: this.name, version: this.version}}
        } else if(fs.existsSync(filePath) === false) {
            filePath = undefined;
        }
    }

    return filePath;
};

/**
 *  @description Gets the directory path of the library
 */
BowerLibrary.prototype.getDirPath = function() {
    return this.LIB_DIRECTORY + '/' + (this.alias || this.name);
};

/**
 * @description Renames the default bower library.
 * @param {string} folderName - New folder name.
 */
BowerLibrary.prototype.renameBowerLibrary = function(folderName) {
    var oldPath,
        newPath;

    oldPath = this.getDirPath();
    newPath = this.LIB_DIRECTORY + '/' + folderName;

    if(oldPath === newPath) return this;

    fs.copySync(oldPath, newPath);

    _deleteDir(this.getDirPath());

    return this;
};

/**
 * Check if this library is installed in the file system
 * @returns {*}
 */
BowerLibrary.prototype.isInstalled = function() {
    return fs.existsSync(this.LIB_DIRECTORY + '/' + this.toString());
};

BowerLibrary.prototype.LIB_DIRECTORY = './bower_components';

//------------------------------------PRIVATE---------------------------------------------------------------------------

function _getLibraryFile() {
    var mainFile;

    if(Array.isArray(this.main)) {
        this.main.forEach(function (fileName) {
            if (fileName.indexOf('.js') !== -1) {
                mainFile =  fileName.replace('./', '');
            }
        });

    //any non bower library is being download to index.js
    } else if(this.isBowerLibrary === false) {
        mainFile = '/index.js';

    } else if(this.main) {
        mainFile = this.main.replace('./', '');

    } else {
        mainFile = this.name + '.js';
    }

    return mainFile;
}

function _handleDependencies(args) {

    //do nothing is there is no dependency
    if(helpers.isEmpty(this.dependencies)) {
        delete this.dependencies;

        return;
    }

    //convert dependencies from object to array
    this.dependencies = Object.keys(this.dependencies).map(function(key, index) {
        var dependency,
            value;

        value = args[0].dependencies[key];

        dependency = {
            name: key
        };

        if(_isUrl(value)) {
            dependency.url = value;
            dependency.isBowerLibrary = false;
        } else {
            dependency.version = value;
            dependency.isBowerLibrary = true;
        }

        return dependency;
    });
}

function _isUrl(value) {
    return (typeof value === 'string') && value.match(_isUrl.URL_REGEX) !== null;
}

_isUrl.URL_REGEX = /(https|http)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;


function _getAlternateFilePath(library) {
    return library.toString() + '/' + _getFallBackObject(library).path;
}

function _getFallBackObject(library) {
    var name = library.alias || library.name;

    return (libraryFallback[name] && (libraryFallback[name][library.version] || libraryFallback[name].default)) || {};
}

//http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
function _deleteDir(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                _deleteDir(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

module.exports = BowerLibrary;