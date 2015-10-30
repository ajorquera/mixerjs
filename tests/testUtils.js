var testUtils,
    phantom;

phantom = require('phantom');

phantom.onConsoleMessage = function(msg) {
    console.log(msg);
};

testUtils = function(options) {
    options = options || {};

    options.port     = options.port     || '8080';
    options.page     = options.page     || 'example.com';
    options.hostname = options.hostname || 'localhost';

    return {
        createEnv: function(path, browserEnvCallback, callback, evaluateHTTPStatus) {
            phantom.create(function (ph) {
                ph.createPage(function (page) {
                    page.open("http://" + options.page, function (status) {
                        page.includeJs('http://' + options.hostname + ':' + options.port + path, function(test) {
                            page.evaluate(browserEnvCallback, function(result) {
                                callback(result);
                                ph.exit();
                            });
                        });

                    });
                });
            }, {path: __dirname + '/../node_modules/phantomjs/bin/'});
        }
    };
};
module.exports = testUtils;