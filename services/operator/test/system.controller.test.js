const expect = require('chai').expect;
const sysCodes = require('northernstars-shared/index').sysCodes;
const serverConf = require('northernstars-shared/index').serverConfig;
const request = require('supertest');
const app = require('../server');
const rp = require('request-promise');
app.set('NODE_ENV', 'development');
app.set('port', 5000);
const env = app.get('NODE_ENV');

beforeEach(done => {
    console.log("START OF TEST");
    done();
});

describe('GET /sys/routes', () => {

    it('should respond with RESOURCE.LOADED (200 "OK") code', done => {
        request(app)
            .get('/api/sys/routes')
            .set('Application-ID', serverConf[env].consumers[0])
            .set('X-Secret', `${serverConf[env].secret.secret}x${serverConf[env].secret.index}`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

});

afterEach(done => {
    console.log("END OF TESTS");
    done();
});
