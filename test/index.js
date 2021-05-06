/* global describe */
/* global it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const NeuralNetwork = require('../src');

const should = chai.should(); // eslint-disable-line

describe('Network', () => {
  describe('Initialize Network', () => {
    const nn = new NeuralNetwork().init(2, [3, 2], 1);

    it('it should create and return a network', (done) => {
      nn.should.be.an('object');
      done();
    });
    it('it have the correct amount of inputs', (done) => {
      nn.inputLayer.inputNodes.length.should.equal(2);
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
      nn.outputLayer.outputNodes.should.be.of.length(1);
      done();
    });
  });

  describe('Forward Propagation', () => {
    const nn = new NeuralNetwork().init(3, [2, 3], 2);
    const forwardPropagation = nn.forwardPropagate([10, 5, -6]);

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

  // describe('Exporting & Importing', () => {
  //   const nn1 = new NeuralNetwork().init(3, [2, 3], 2);
  //   const nn2 = new NeuralNetwork().init(3, [3], 2);
  //   const forwardPropagation1 = nn1.forwardPropagate([10, 5, -6]);
  //   const forwardPropagation2 = nn2.forwardPropagate([10, 5, -6]);
  //
  //   it('neural networks should not share the same output', (done) => {
  //     forwardPropagation1.should.not.deep.equal(forwardPropagation2);
  //     done();
  //   });
  //   it('neural networks should export a string', (done) => {
  //     nn1.exportNetwork().should.be.a('string');
  //     nn2.exportNetwork().should.be.a('string');
  //     done();
  //   });
  //   it('neural networks should export a parseable object', (done) => {
  //     JSON.parse(nn1.exportNetwork()).should.be.an('object');
  //     JSON.parse(nn2.exportNetwork()).should.be.an('object');
  //     done();
  //   });
  //   it('neural networks should import parsed exports', (done) => {
  //     const nn1Export = JSON.parse(nn1.exportNetwork());
  //     nn2.importNetwork(nn1Export);
  //     nn2.inputLayer.inputNodes.length.should.equal(nn1.inputLayer.inputNodes.length);
  //     nn2.hiddenLayers.length.should.equal(nn1.hiddenLayers.length);
  //     nn2.outputLayer.nodes.length.should.equal(nn1.outputLayer.nodes.length);
  //     done();
  //   });
  //   it('equal neural networks should share the same output with the same inputs', (done) => {
  //     nn2.forwardPropagate([10, 5, -6]).should.deep.equal(forwardPropagation1);
  //     done();
  //   });
  // });
});
