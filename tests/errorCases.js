var supertest,
    mixerjs,
    expect;

mixerjs   = require('../mixer.js');
expect    = require('chai').expect;
supertest = require('supertest');

describe('mixerjs error cases', function() {

    it('should get error DUPLICATED with /mixer.js?jquery&jquery', function (done) {
        supertest(mixerjs).get('/mixer.js?jquery&jquery').expect(function(res) {
            expect(res.status).to.equal(409);
            expect(res.body.error).to.equal('DUPLICATED');
        }).end(done)
    });

    it('should get error NOT_FOUND with /mixer.js?jqueryy', function (done) {
        supertest(mixerjs).get('/mixer.js?jqueryy').expect(function(res) {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('NOT_FOUND');
        }).end(done)
    });

    it('should get error WRONG_VERSION with /mixer.js?jquery=8.8.9', function (done) {
        supertest(mixerjs).get('/mixer.js?jquery=8.8.9').expect(function(res) {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('WRONG_VERSION');
        }).end(done)
    });

    it('should get error NO_PARAMS with /mixer.js', function (done) {
        supertest(mixerjs).get('/mixer.js').expect(function(res) {
            expect(res.status).to.equal(400);
            expect(res.body.error).to.equal('NO_PARAMS');
        }).end(done)
    });

    it('should get error INVALID_PATH with /filename?jquery', function (done) {
        supertest(mixerjs).get('/filename?jquery').expect(function(res) {
            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('INVALID_PATH');
        }).end(done)
    });

    it('should get error INVALID_PATH with /test.txt?jquery', function (done) {
        supertest(mixerjs).get('/test.txt?jquery').expect(function(res) {
            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('INVALID_PATH');
        }).end(done)
    });

    it('should get error INVALID_FILEPATH with /mixer.js?jquery-easing-original', function (done) {
        supertest(mixerjs).get('/mixer.js?jquery-easing-original').expect(function(res) {
            expect(res.status).to.equal(500);
            expect(res.body.error).to.equal('INVALID_FILEPATH');
        }).end(done)
    });
});
