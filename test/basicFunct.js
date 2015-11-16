var testUtils,
    mixerjs,
    expect;

mixerjs   = require('../mixer.js');
expect    = require('chai').expect;
testUtils = require('./testUtils')({port: '7070'});

describe('mixerjs basic functionality', function() {

    this.timeout(10000);

    before(function() {
        mixerjs.listen(7070)
    });

    //TODO be careful with latest version. It may break the test with time
    describe('latest library version ', function() {

        it('should get /mixer.js?bootstrap-timepicker', function (done) {
            testUtils.createEnv('/mixer.js?bootstrap-timepicker', function () {
                return window.jQuery;
            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.equal('2.1.4');
                expect(jQuery.fn.timepicker).to.exist;

                done();
            });
        });

        it('should get /mixer.js?jquery', function (done) {
            testUtils.createEnv('/mixer.js?jquery', function () {
                return window.jQuery;
            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.equal('2.1.4');
                done();
            });
        });

        it('should get /mixer.js?intense-images', function (done) {
            testUtils.createEnv('/mixer.js?intense-images', function () {
                return window.Intense;
            }, function (Intense) {
                expect(Intense).to.exist;
                done();
            });
        });

        it('should get /mixer.js?angular', function (done) {
            testUtils.createEnv('/mixer.js?angular', function () {
                return window.angular;
            }, function (angular) {
                expect(angular.version.full).to.equal('1.4.7');
                done();
            });
        });

        it('should get /mixer.js?jquery&tinynav', function (done) {
            testUtils.createEnv('/mixer.js?jquery&tinynav', function () {
                return window.jQuery;
            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.equal('2.1.4');
                expect(jQuery.fn.tinyNav).to.exist;

                done();
            });
        });

        it('should get /mixer.js?foundation', function (done) {
            testUtils.createEnv('/mixer.js?foundation', function () {
                return {
                    jQuery              : jQuery,
                    Modernizr           : Modernizr,
                    FastClick           : FastClick
                };

            }, function (libraries) {
                expect(libraries.jQuery.fn.jquery).to.be.above('2.1.0');
                expect(libraries.Modernizr).to.exist;
                expect(libraries.FastClick).to.exist;
                expect(libraries.jQuery.cookie).to.exist;
                expect(libraries.jQuery.fn.placeholder).to.exist;
                done();
            });
        });

        it('should get /mixer.js?bootstrap', function (done) {
            testUtils.createEnv('/mixer.js?bootstrap', function () {
                return jQuery;

            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.be.above('1.9.1');
                expect(jQuery.fn.modal).to.exist;
                expect(jQuery.fn.dropdown).to.exist;
                expect(jQuery.support.transition).to.exist;
                expect(jQuery.fn.scrollspy).to.exist;
                expect(jQuery.fn.tab).to.exist;
                expect(jQuery.fn.tooltip).to.exist;
                expect(jQuery.fn.popover).to.exist;
                expect(jQuery.fn.alert).to.exist;
                expect(jQuery.fn.button).to.exist;
                expect(jQuery.fn.collapse).to.exist;
                expect(jQuery.fn.carousel).to.exist;
                expect(jQuery.fn.affix).to.exist;

                //property remove after version 3
                expect(jQuery.fn.typeahead).to.not.exist;

                done();
            });
        });

    });


    describe('libraries with versions', function() {

        it('should get /mixer.js?angular-strap=2.1.1', function (done) {
            testUtils.createEnv('/mixer.js?angular-strap=2.1.1', function () {
                return angular;

            }, function (angular) {
                expect(angular.version.full).to.equal('1.4.7');

                done();
            });
        });

        it('should get /mixer.js?blast=0.1.0', function (done) {
            testUtils.createEnv('/mixer.js?blast=0.1.0', function () {
                return blast;

            }, function (blast) {
                expect(blast).to.exist;

                done();
            });
        });

        it('should get /mixer.js?bootstrap=2.3.2', function (done) {
            testUtils.createEnv('/mixer.js?bootstrap=2.3.2', function () {
                return jQuery;

            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.be.within('1.8.0', '2.1.0');
                expect(jQuery.fn.modal).to.exist;
                expect(jQuery.fn.dropdown).to.exist;
                expect(jQuery.support.transition).to.exist;

                //property remove after version 3
                expect(jQuery.fn.typeahead).to.exist;

                done();
            });
        });


        //multiple libraries
        it('should get /mixer.js?lodash&jquery&angular', function (done) {
            testUtils.createEnv('/mixer.js?lodash&jquery&angular', function () {
                return {
                    lodash  : _,
                    jQuery  : jQuery,
                    angular : angular
                };

            }, function (libraries) {
                expect(libraries.jQuery.fn.jquery).to.equal('2.1.4');
                expect(libraries.lodash.VERSION).to.equal('3.10.1');
                expect(libraries.angular.version.full).to.equal('1.4.7');

                done();
            });
        });

        //FIXME for some reason, this test is not passing
        xit('should get /mixer.js?mathjs=1.1.0&jquery&react=0.3.3', function (done) {
            testUtils.createEnv('/mixer.js?mathjs=2.4.1&jquery&react=0.3.3', function () {
                return {
                    math    : window.math,
                    jQuery  : window.jQuery,
                    React   : window.React
                };

            }, function (libraries) {

                expect(libraries.jQuery.fn.jquery).to.equal('2.1.4');
                expect(libraries.React).to.exist;
                expect(libraries.math.version).to.equal('1.4.7');

                done();
            });
        });

        it('should get /mixer.js?lodash=2.1.0&angular&jquery', function (done) {
            testUtils.createEnv('/mixer.js?lodash=2.1.0&angular&jquery', function () {
                return {
                    lodash  : _,
                    jQuery  : jQuery,
                    angular : angular
                };

            }, function (libraries) {
                expect(libraries.jQuery.fn.jquery).to.equal('2.1.4');
                expect(libraries.lodash.VERSION).to.equal('2.1.0');
                expect(libraries.angular.version.full).to.equal('1.4.7');

                done();
            });
        });

    });


    describe('multiple libraries with dependencies between each other', function() {

        //FIXME for some reason the test is not passing
        xit('should get /mixer.js?backbone&moment&ember', function (done) {
            testUtils.createEnv('/mixer.js?backbone&moment&ember', function () {
                return {
                    Backbone : window.Backbone,
                    moment   : window.moment,
                    ember    : window.ember,
                    jQuery   : window.jQuery
                };

            }, function (libraries) {

                expect(libraries.Backbone.VERSION).to.equal('1.2.3');
                expect(libraries.jQuery.fn.jquery).to.equal('2.1.4');
                expect(libraries.moment.version).to.equal('2.10.6');
                expect(libraries.angular.version.full).to.equal('1.4.7');

                done();
            });
        });

        it('should get /mixer.js?toastr&jquery', function (done) {
            testUtils.createEnv('/mixer.js?toastr&jquery', function () {
                return {
                    toastr : toastr,
                    jQuery : jQuery
                };

            }, function (libraries) {

                expect(libraries.toastr.version).to.equal('2.1.2');
                expect(libraries.jQuery.fn.jquery).to.equal('2.1.4');

                done();
            });
        });

    });

    //minified versions
    describe('libraries using it\'s minified version', function() {

        it('should get /mixer.min.js?jquery', function (done) {
            testUtils.createEnv('/mixer.min.js?jquery', function () {
                return window.jQuery;
            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.equal('2.1.4');
                done();
            });
        });

        it('should get /mixer.min.js?intense-images', function (done) {
            testUtils.createEnv('/mixer.min.js?intense-images', function () {
                return window.Intense;

            }, function (Intense) {
                expect(Intense).to.exist;
                done();
            });
        });

        it('should get /mixer.min.js?foundation', function (done) {
            testUtils.createEnv('/mixer.min.js?foundation', function () {
                return {
                    jQuery              : jQuery,
                    Modernizr           : Modernizr,
                    FastClick           : FastClick
                };

            }, function (libraries) {
                expect(libraries.jQuery.fn.jquery).to.be.above('2.1.0');
                expect(libraries.Modernizr).to.exist;
                expect(libraries.FastClick).to.exist;
                expect(libraries.jQuery.cookie).to.exist;
                expect(libraries.jQuery.fn.placeholder).to.exist;
                done();
            });
        });

        it('should get /mixer.min.js?bootstrap', function (done) {
            testUtils.createEnv('/mixer.min.js?bootstrap', function () {
                return jQuery;

            }, function (jQuery) {
                expect(jQuery.fn.jquery).to.be.above('1.9.1');
                expect(jQuery.fn.modal).to.exist;
                expect(jQuery.fn.dropdown).to.exist;
                expect(jQuery.support.transition).to.exist;
                expect(jQuery.fn.scrollspy).to.exist;
                expect(jQuery.fn.tab).to.exist;
                expect(jQuery.fn.tooltip).to.exist;
                expect(jQuery.fn.popover).to.exist;
                expect(jQuery.fn.alert).to.exist;
                expect(jQuery.fn.button).to.exist;
                expect(jQuery.fn.collapse).to.exist;
                expect(jQuery.fn.carousel).to.exist;
                expect(jQuery.fn.affix).to.exist;

                //property remove after version 3
                expect(jQuery.fn.typeahead).to.not.exist;


                done();
            });
        });
    });

    describe('real use for mixerjs', function() {
        it('should get 30 different libraries with specific versions', function (done) {
            testUtils.createEnv('/mixer.js?angular=1.2.26&angular-animate=1.2.26&angular-bootstrap=0.11.0&angular-cookies=1.2.26&angular-elastic=2.4.2&angular-gravatar=0.2.1&angular-input-match&angular-loader=1.2.26&angular-mocks=1.2.26&angular-resource=1.2.26&angular-route=1.2.26&angular-sanitize=1.2.26&angular-strap=2.1.1&angular-ui-select=0.8.3&angular-xeditable=0.1.9&bootstrap-timepicker=0.2.6&cropper=0.7.8&iscroll=5.1.1&angular-libphonenumber=0.0.7&lodash=3.10.1&moment=2.8.3&ng-file-upload=2.2.0&ng-tags-input=2.3.0&pikaday-angular=1.0.3&requirejs=2.1.15&select2=3.4.5&socket.io-client=1.3.2&toastr=2.0.3&validate=0.3.2&vis=3.5.0&jquery=2.1.4', function () {
                return jQuery;

            }, function (jQuery) {

                //property remove after version 3
                expect(jQuery.fn.typeahead).to.not.exist;


                done();
            });
        });
    })
});
