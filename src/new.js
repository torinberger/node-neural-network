const Mathjs = require('mathjs');

function sigmoid(t) {
  return 1 / (1 + Math.E ** (-t));
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

class Network {
  constructor(nOfInputs, nOfLayers, nOfNodesInLayers, nOfOutputs) {
    this.nOfInputs = nOfInputs;
    this.nOfLayers = nOfLayers;
    this.nOfNodesInLayers = nOfNodesInLayers;
    this.nOfOutputs = nOfOutputs;

    this.zs = [];
    this.as = [];

    this.weights = [];
    this.biases = [];
    for (let i = 0; i < nOfLayers + 1; i++) {
      this.weights[i] = [];
      this.biases[i] = [];
      let nOfNodesInLayer = i === nOfLayers ? nOfOutputs : nOfNodesInLayers[i];
      for (let n = 0; n < nOfNodesInLayer; n++) {
        this.weights[i][n] = [];
        this.biases[i][n] = randomWeight();
        let nOfNodesInPreviousLayer = i === 0 ? nOfInputs : nOfNodesInLayers[i - 1];
        for (let k = 0; k < nOfNodesInPreviousLayer; k++) {
          this.weights[i][n][k] = randomWeight();
        }
      }
    }
  }

  forwardPropagate(inputs) {
    if (inputs.length !== this.nOfInputs) { throw 'Incorrect input length'; }

    this.zs = [];
    this.as = [];
    for (let i = 0; i < this.nOfLayers + 1; i++) {
      let lastLayerValues = i === 0 ? inputs : this.as[i - 1];
      let zs = Mathjs.add(Mathjs.multiply(this.weights[i], lastLayerValues), this.biases[i]);
      let as = Array.from(zs, (x) => sigmoid(x));
      this.zs.push(zs);
      this.as.push(as);
    }

    return this.as[this.as.length - 1];
  }
}

module.exports = Network;
