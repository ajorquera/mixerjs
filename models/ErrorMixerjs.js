var ErrorMixerjs,
    templateSys,
    util;

util         = require('util');
templateSys  = require('string-template');

/**
 * @description Error class that manages all errors in mixerjs
 * @augments Error
 * @param properties
 * @constructor
 */
ErrorMixerjs = function(properties) {
    var _errorType;

    Error.call(this);

    _errorType = ErrorMixerjs._errors[properties.name];
    if(_errorType === undefined) {
        _errorType = ErrorMixerjs._errors.UNKNOWN;
    }

    this.name       = properties.name;
    this.params     = properties.params;
    this.httpStatus = _errorType.httpCodeStatus;
    this.message    = properties.message || templateSys(_errorType.msgTemplate, this.params);
};

util.inherits(ErrorMixerjs, Error);

ErrorMixerjs._errors = {
    NO_PARAMS: {
        name           : 'NO_PARAMS',
        httpCodeStatus : 400,
        msgTemplate    : 'Not supplied parameters'
    },

    DUPLICATED: {
        name           : 'DUPLICATED',
        httpCodeStatus : 409,
        msgTemplate    : 'DUPLICATED: Duplicated library:: {library}'
    },

    CONFLICT: {
        name           : 'CONFLICT',
        httpCodeStatus : 409,
        msgTemplate    : 'Conflict error'
    },

    NOT_FOUND: {
        name           : 'NOT_FOUND',
        httpCodeStatus : 404,
        msgTemplate    : 'Library not found: {library}'
    },

    WRONG_VERSION: {
        name           : 'WRONG_VERSION',
        httpCodeStatus : 404,
        msgTemplate    : 'Library {library}. {details}'
    },

    NO_CUSTOM: {
        name : 'NO_CUSTOM',
        httpCodeStatus : 404,
        msgTemplate    : 'Library "{library}" doesn\'t supported custom build'
    },

    INVALID_FILEPATH: {
        name           : 'INVALID_FILEPATH',
        httpCodeStatus : 500,
        msgTemplate    : 'Library "{name}-{version}" has a problem with it\'s file path'
    },

    UNKNOWN: {
        name           : 'UNKNOWN',
        httpCodeStatus : 500,
        msgTemplate    : 'An unknown error occurred, please create an issue in https://github.com/ajorquera/mixerjs/issues'
    }
};

module.exports = ErrorMixerjs;