/* global describe */
/* global it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const NeuralNetwork = require('../index');

const should = chai.should(); // eslint-disable-line

describe('Network', () => {
  describe('Initialize Network', () => {
    let nn = new NeuralNetwork().init(2, [3, 2], 1);
    it('it should create and return a network', (done) => {
      nn.should.be.an('object');
      done();
    });
    it('it have the correct amount of inputs', (done) => {
      nn.inputLayer.nOfInputs.should.equal(2);
      done();
    });
    it('it have the correct amount of layers', (done) => {
      nn.hiddenLayers.should.be.an('array');
      nn.hiddenLayers.should.be.of.length(2);
      done();
    });
    it('it have the correct amount of nodes', (done) => {
      nn.hiddenLayers[0].should.be.an('object');
      nn.hiddenLayers[0].nodes.should.be.of.length(3);
      done();
    });
    it('it have the correct amount of outputs', (done) => {
      nn.outputLayer.nodes.should.be.of.length(1);
      done();
    });
  });

  describe('Forward Propagation', () => {
    let nn = new NeuralNetwork().init(3, [2, 3], 2);
    let forwardPropagation = nn.forwardPropagate([10, 5, -6]);
    console.log(forwardPropagation);
    it('it should return an array', (done) => {
      forwardPropagation.should.be.an('array');
      forwardPropagation.should.be.of.length(2);
      done();
    });
    it('it should return an array of number', (done) => {
      forwardPropagation[0].should.be.a('number');
      forwardPropagation[1].should.be.a('number');
      done();
    });
  });
});
