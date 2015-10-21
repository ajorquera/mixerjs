var fs = require('fs');
var errors = require('../../../../errors/errors');

versions = JSON.parse(fs.readFileSync('./models/custom/libraries/jquery/jqueryVersions.json','utf-8'));

//error version incorrect
errors.errorList.JQUERY_VERSIONBAD = {};
errors.errorList.JQUERY_VERSIONBAD.code = 400;
errors.errorList.JQUERY_VERSIONBAD.msg = "Not version found";
errors.errorList.JQUERY_VERSIONBAD.file = false;
errors.errorList.JQUERY_VERSIONBAD.extra = versions;

//bad params
errors.errorList.JQUERY_PARAMBAD = {};
errors.errorList.JQUERY_PARAMBAD.code = 409;
errors.errorList.JQUERY_PARAMBAD.msg = "Wrong parameter";
errors.errorList.JQUERY_PARAMBAD.file = false;
errors.errorList.JQUERY_PARAMBAD.extra = "parameter must be version or exclude key";

//empty modules 
errors.errorList.JQUERY_EMPTYEXCLUDE ={};
errors.errorList.JQUERY_EMPTYEXCLUDE.code = 409;
errors.errorList.JQUERY_EMPTYEXCLUDE.msg = "Empty exclude parameter";
errors.errorList.JQUERY_EMPTYEXCLUDE.file = false;
errors.errorList.JQUERY_EMPTYEXCLUDE.extra = "";

module.exports = errors; 