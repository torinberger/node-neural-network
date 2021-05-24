const Mathjs = require('mathjs');

function sigmoid(t) {
  return 1 / (1 + Math.E ** (-t));
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

let weights = [[-1, 1, 1], [1, 1, 1]];
let outputs = [0.5, 1, 0];
let biases = [1, -1];

let z = Mathjs.add(Mathjs.multiply(weights, outputs), biases);
let a = Array.from(z, (x) => sigmoid(x));

console.log(a);

class Node {
  constructor(nOfNodesInPreviousLayer) {
    this.weights = [];

    for (let i = 0; i < nOfNodesInPreviousLayer; i++) {
      this.weights[i] = randomWeight();
    }
  }
}

class Layer {
  constructor(nOfNodesInPreviousLayer, nOfNodesInLayer) {
    this.nOfNodesInPreviousLayer = nOfNodesInPreviousLayer;
    this.nodes = [];

    for (let i = 0; i < nOfNodesInPreviousLayer; i++) {
      this.nodes = new Node(nOfNodesInPreviousLayer);
    }
  }
}

class Network {
  constructor(nOfInputs, nOfLayers, nOfNodesInLayers, nOfOutputs) {
    this.nOfInputs = nOfInputs;
    this.nOfLayers = nOfLayers;
    this.nOfNodesInLayers = nOfNodesInLayers;
    this.nOfOutputs = nOfOutputs;
    this.layers = [];

    for (let i = 0; i < nOfLayers; i++) {
      const nOfNodesInPreviousLayer = i === 0 ? nOfInputs : nOfNodesInLayers[i - 1];
      this.layers[i] = new Layer(nOfNodesInPreviousLayer, nOfNodesInLayer[i]);
    }
  }

  forwardPropagate(inputs) {
    if (inputs !== this.nOfInputs) { throw 'Incorrect input length'; }
    for (let i = 0; i < this.nOfLayers; i++) {
      let z = Mathjs.add(Mathjs.multiply(weights, outputs), biases);
      let a = Array.from(z, (x) => sigmoid(x));
    }
  }
}
