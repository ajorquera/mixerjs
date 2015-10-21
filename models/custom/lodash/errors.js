var errors = require('../../../../errors/errors');

//bad params
errors.errorList.LODASH_PARAMBAD = {};
errors.errorList.LODASH_PARAMBAD.code = 409;
errors.errorList.LODASH_PARAMBAD.msg = "Wrong parameter";
errors.errorList.LODASH_PARAMBAD.file = false;
errors.errorList.LODASH_PARAMBAD.extra = "parameter must be version or modules key";

//empty modules 
errors.errorList.LODASH_EMPTYMODULES ={};
errors.errorList.LODASH_EMPTYMODULES.code = 409;
errors.errorList.LODASH_EMPTYMODULES.msg = "Empty modules loadash";
errors.errorList.LODASH_EMPTYMODULES.file = false;
errors.errorList.LODASH_EMPTYMODULES.extra = "";

//empty category

errors.errorList.LODASH_EMPTYCATEGORY = {}
errors.errorList.LODASH_EMPTYCATEGORY.code = 409;
errors.errorList.LODASH_EMPTYCATEGORY.msg = "Empty category.";
errors.errorList.LODASH_EMPTYCATEGORY.file = false;
errors.errorList.LODASH_EMPTYCATEGORY.extra = "categorys available: array, chain, collection, date, function, lang, object, number, string, utility";

//category not match

errors.errorList.LODASH_CATEGORYNOTMATCH = {}
errors.errorList.LODASH_CATEGORYNOTMATCH.code = 409;
errors.errorList.LODASH_CATEGORYNOTMATCH.msg = "Invalid arguments in category array";
errors.errorList.LODASH_CATEGORYNOTMATCH.file = false;
errors.errorList.LODASH_CATEGORYNOTMATCH.extra = "";

//empty type

errors.errorList.LODASH_TYPEEMPTY = {}
errors.errorList.LODASH_TYPEEMPTY.code = 409;
errors.errorList.LODASH_TYPEEMPTY.msg = "Empty type";
errors.errorList.LODASH_TYPEEMPTY.file = false;
errors.errorList.LODASH_TYPEEMPTY.extra = "types available: strict, modern, compat";

//type not match

errors.errorList.LODASH_TYPENOTMATCH = {}
errors.errorList.LODASH_TYPENOTMATCH.code = 409;
errors.errorList.LODASH_TYPENOTMATCH.msg = "Invalid arguments in type";
errors.errorList.LODASH_TYPENOTMATCH.file = false;
errors.errorList.LODASH_TYPENOTMATCH.extra = "";

//empty plus

errors.errorList.LODASH_EMPTYPLUS = {}
errors.errorList.LODASH_EMPTYPLUS.code = 409;
errors.errorList.LODASH_EMPTYPLUS.msg = "Empty plus.";
errors.errorList.LODASH_EMPTYPLUS.file = false;
errors.errorList.LODASH_EMPTYPLUS.extra = "";

//empty minus

errors.errorList.LODASH_EMPTYMINUS = {}
errors.errorList.LODASH_EMPTYMINUS.code = 409;
errors.errorList.LODASH_EMPTYMINUS.msg = "Empty minus.";
errors.errorList.LODASH_EMPTYMINUS.file = false;
errors.errorList.LODASH_EMPTYMINUS.extra = "";

//empty include

errors.errorList.LODASH_EMPTYINCLUDE = {}
errors.errorList.LODASH_EMPTYINCLUDE.code = 409;
errors.errorList.LODASH_EMPTYINCLUDE.msg = "Empty include";
errors.errorList.LODASH_EMPTYINCLUDE.file = false;
errors.errorList.LODASH_EMPTYINCLUDE.extra = "";

// include not match

errors.errorList.LODASH_INCLUDENOTMATCH = {}
errors.errorList.LODASH_INCLUDENOTMATCH.code = 409;
errors.errorList.LODASH_INCLUDENOTMATCH.msg = "Invalid arguments in include array";
errors.errorList.LODASH_INCLUDENOTMATCH.file = false;
errors.errorList.LODASH_INCLUDENOTMATCH.extra = "";

//empty exports

errors.errorList.LODASH_EMPTYEXPORTS = {}
errors.errorList.LODASH_EMPTYEXPORTS.code = 409;
errors.errorList.LODASH_EMPTYEXPORTS.msg = "Empty exports";
errors.errorList.LODASH_EMPTYEXPORTS.file = false;
errors.errorList.LODASH_EMPTYEXPORTS.extra = "";

// exports not match

errors.errorList.LODASH_EXPORTSNOTMATCH = {}
errors.errorList.LODASH_EXPORTSNOTMATCH.code = 409;
errors.errorList.LODASH_EXPORTSNOTMATCH.msg = "Invalid arguments in exports array.";
errors.errorList.LODASH_EXPORTSNOTMATCH.file = false;
errors.errorList.LODASH_EXPORTSNOTMATCH.extra = "";

//invalid lodash arguments

errors.errorList.LODASH_INVALIDARGUMENT = {}
errors.errorList.LODASH_INVALIDARGUMENT.code = 409;
errors.errorList.LODASH_INVALIDARGUMENT.msg = "Invalid arguments in lodash query.";
errors.errorList.LODASH_INVALIDARGUMENT.file = false;
errors.errorList.LODASH_INVALIDARGUMENT.extra = "";

module.exports = errors; 
