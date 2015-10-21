var errorHandler,
    ErrorMixerjs;

ErrorMixerjs = require('../models/ErrorMixerjs.js');

//TODO maybe it would be better to throw the error.
errorHandler = function(errorObject, req, res, next) {
    var error;

    if(errorObject instanceof Error) {
        console.log(errorObject.stack);
    }

    error = new ErrorMixerjs(errorObject);

    res.status(error.httpStatus).send({
        error   : error.name,
        message : error.toString()
    });
};

module.exports = errorHandler;