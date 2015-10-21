var libraryFallback,
    helpers,
    fs;

libraryFallback = require('../libraryConsistency.json');
helpers         = require('./helpers');
fs              = require('fs-extra');

//---------------------------------------------------------------------------------------------------------------------
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

        /*
         * Some libraries has something like an alias. Where the name of the library is different when you download it
         * with bower
         */
        this.alias   = args[0].alias;

        //convert dependencies from object to array
        if(this.dependencies && Object.keys(this.dependencies).length > 0) {
            this.dependencies = Object.keys(this.dependencies).map(function(key, index) {
                return {
                    name: key,
                    version: args[0].dependencies[key]
                };
            });

        //some libraries has an empty dependencies object
        } else if(helpers.isEmpty(this.dependencies)) {
            delete this.dependencies;
        }

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
    return (this.alias || this.name) + '#' + this.version;
};

/**
 * @description Gets the path for the file library.
 * @returns {string}
 */
BowerLibrary.prototype.getFilePath = function() {
    var main,
        filePath;

    if(Array.isArray(this.main)) {
        this.main.forEach(function(fileName) {
            if(fileName.indexOf('.js') !== -1) {
                main = fileName;
            }
        });
    } else {
        main = this.main
    }

    filePath = this.LIB_DIRECTORY + '/' + this.toString() + '/' + (main ? main.replace('./', '') : this.name + '.js' );

    if (fs.existsSync(filePath) === false) {
        filePath = this.LIB_DIRECTORY + '/' + _getFilePath(this);

        if (filePath === undefined || fs.existsSync(filePath) === false) {
            throw {name: 'INVALID_FILEPATH', params: {name: this.name, version: this.version}}
        }
    }

    return filePath;
};

/**
 *  @description Gets the directory path of the library
 */
BowerLibrary.prototype.getDirPath = function() {
    return this.LIB_DIRECTORY + '/' + _getDir(this);
};

/**
 * @description Renames the default bower library.
 * @param {string} folderName - New folder name.
 */
BowerLibrary.prototype.renameBowerLibrary = function(folderName) {
    fs.copySync(this.getDirPath(), this.LIB_DIRECTORY + '/' + folderName);

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

//get dir bower library
function _getDir(library) {
    var name = library.alias || library.name;

    return _getFallBackObject(library).directory || name;
}

function _getFilePath(library) {
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