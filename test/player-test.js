process.env.NODE_ENV = 'dev';
let proxyquire = require('proxyquire');
let mongooseMock = require("./mong-mock");
let Player = proxyquire('../app/models/player',{mongoose:mongooseMock});
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Players', () => {
    beforeEach((done) => {
        Player.remove({}, (err) => { 
           done();         
        });     
    });
  describe('/GET player', () => {
      it('it should GET all the players', (done) => {
        chai.request(server)
            .get('/player')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/POST player', () => {
      it('it should not POST a player without pages field', (done) => {
        let player = {
            name: "L Messi",
            club: "BARCA"
//            number: 10
        }
        chai.request(server)
            .post('/player')
            .send(player)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('number');
                res.body.errors.number.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a player ', (done) => {
        let player = {
            name: "Zlatan",
            club: "MANU",
            number: 10
        }
        chai.request(server)
            .post('/player')
            .send(player)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Player successfully added!');
                res.body.player.should.have.property('name');
                res.body.player.should.have.property('club');
                res.body.player.should.have.property('number');
              done();
            });
      });
  });
});