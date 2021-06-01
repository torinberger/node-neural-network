const Mathjs = require('mathjs');

function sigmoid(t) {
  return 1 / (1 + Math.E ** (-t));
}

function sigmoidDerivative(t) {
  return sigmoid(t) * (1 - sigmoid(t));
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

class Network {
  constructor(nOfInputs, nOfNodesInLayers, nOfOutputs) {
    console.log(nOfInputs, nOfNodesInLayers, nOfOutputs);
    this.nOfInputs = nOfInputs;
    this.nOfLayers = nOfNodesInLayers.push(nOfOutputs); // add number of outputs to array of number of nodes in layer
    this.nOfNodesInLayers = nOfNodesInLayers;
    this.nOfOutputs = nOfOutputs;

    this.zs = [];
    this.as = [];
    this.weights = [];
    this.biases = [];
    this.deltaWeights = [];
    this.deltaBiases = [];
    this.deltaActivations = [];

    for (let i = 0; i < this.nOfLayers + 1; i++) {
      this.weights[i] = [];
      this.biases[i] = [];
      let nOfNodesInLayer = i === this.nOfLayers ? nOfOutputs : nOfNodesInLayers[i];
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

  backPropagate(inputs, expectedOutputs) {
    if (inputs.length !== this.nOfInputs) { throw 'Incorrect input length'; }
    if (expectedOutputs.length !== this.nOfOutputs) { throw 'Incorrect output length'; }

    this.deltaWeights = [];
    this.deltaBiases = [];
    this.deltaActivations = [];

    let propagation = this.forwardPropagate(inputs);

    for (let layer = this.nOfLayers - 1; layer > -1; layer--) {
      console.log('loop layer', layer, 'with', this.nOfNodesInLayers[layer], 'nodes');
      this.deltaWeights[layer] = [];
      this.deltaBiases[layer] = [];
      this.deltaActivations[layer] = [];

      if (layer !== this.nOfLayers - 1) {
        for (let nextLayerNode = 0; nextLayerNode < this.nOfNodesInLayers[layer - 1]; nextLayerNode++) {
          this.deltaActivations[layer - 1][nextLayerNode] = 0;
          for (let currentNode = 0; currentNode < this.nOfNodesInLayers[layer]; currentNode++) {
            let weight = this.weights[layer][currentNode][nextLayerNode];
            let sigmoidDerivativeOfZ = sigmoidDerivative(this.zs[layer][currentNode]);
            let costDerivative;
            if (layer === this.nOfLayers - 1) {
              costDerivative = 2 * (propagation[currentNode] - expectedOutputs[currentNode]);
            } else {
              costDerivative = this.deltaActivations[layer][currentNode];
            }
            this.deltaActivations[layer - 1][nextLayerNode] += weight * sigmoidDerivativeOfZ * costDerivative;
          }
        }
      } else {
        // nothing
      }

    }
  }
}

module.exports = Network;
