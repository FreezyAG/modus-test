/* eslint-disable no-undef */

// Require dependencies
const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../api');

const app = server;
const should = chai.should();

chai.use(chaiHttp);

// Testing Get Vehicles
// eslint-disable-next-line no-undef
describe('/Get vehicle data', () => {
  // eslint-disable-next-line no-undef
  it('should respond with data on vehicles', (done) => {
    chai.request(app)
      .get('/vehicles/2015/Audi/A3')
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.should.have.property('code');
        res.body.should.have.property('message').eql('Data gotten successfully');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('error').eql(false);
        done();
      });
  });
});


// Test post body to get vehicle data

describe('/Get vehicle data', () => {
  it('should respond with data on post to get vehicles data', (done) => {
    chai.request(app)
      .post('/vehicles')
      .send({
        modelYear: 2015,
        manufacturer: 'Audi',
        model: 'A3'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.should.have.property('code');
        res.body.should.have.property('message').eql('Data gotten successfully');
        res.body.should.have.property('code').eql(200);
        res.body.should.have.property('error').eql(false);
        done();
      });
  });
});

// Test post body to get vehicle data with no content returned

describe('/Get vehicle data and respond with no data', () => {
  it('should respond with no data', (done) => {
    chai.request(app)
      .post('/vehicles')
      .send({
        modelYear: 2013,
        manufacturer: 'Ford',
        model: 'Crown'
      })
      .end((err, res) => {
        if (err) done(err);
        res.should.have.status(200);
        res.body.should.have.property('message');
        res.body.should.have.property('code');
        res.body.should.have.property('message').eql('No content available');
        res.body.should.have.property('code').eql(204);
        res.body.should.have.property('error').eql(false);
        res.body.data.should.have.property('Results').eql([]);
        res.body.data.should.have.property('Count').eql(0);
        done();
      });
  });
});
