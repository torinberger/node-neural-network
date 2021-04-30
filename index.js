const Mathjs = require('mathjs');

function sigmoid(t) {
  return 1 / (1 + Math.E ** (-t));
}

// function randomInRange(min, max) {
//   return Math.round(Math.random() * (max - min) + min);
// }

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

// function chanceToBool(chance) {
//   return Math.random() * (100 - 0) + 0 <= chance;
// }

const InputLayer = function InputLayer() {
  this.nOfInputs = null; // store number of inputs for exporting

  this.init = function init(nOfInputs) {
    this.nOfInputs = nOfInputs; // set number of inputs
    return this;
  };

  this.forwardPropagate = function forwardPropagate(inputs) {
    return inputs; // return inputs as outputs
  };

  this.exportLayer = function exportLayer() {
    return {
      nOfInputs: this.nOfInputs,
    };
  };

  return this;
};

const Node = function Node() {
  this.weights = [];
  this.bias = 0;

  this.init = function init(nOfNodesInPreviousLayer) {
    this.weights = [];
    this.bias = randomWeight();
    // create weight for each node in previous layer
    for (let i = 0; i < nOfNodesInPreviousLayer; i += 1) {
      this.weights[i] = randomWeight();
    }

    return this;
  };

  this.forwardPropagate = function forwardPropagate(inputs) {
    // multiply weights by inputs, add bias and sigmoid the sum, return as output
    return sigmoid(Mathjs.multiply(this.weights, inputs) + this.bias);
  };

  this.exportNode = function exportNode() {
    return { // export object to be JSONified for storage
      weights: this.weights,
      bias: this.bias,
    };
  };

  return this;
};

const HiddenLayer = function HiddenLayer() {
  this.nodes = [];

  this.init = function init(nOfNodes, nOfNodesInPreviousLayer) {
    this.nodes = [];
    for (let i = 0; i < nOfNodes; i += 1) {
      // create nodes and provide custom data if needed
      this.nodes[i] = new Node().init(nOfNodesInPreviousLayer);
    }

    return this;
  };

  this.forwardPropagate = function forwardPropagate(inputs) {
    const nodeOutputs = [];
    for (let i = 0; i < this.nodes.length; i += 1) {
      // forward propagate each node and store their value
      nodeOutputs[i] = this.nodes[i].forwardPropagate(inputs);
    }

    return nodeOutputs; // return node outputs
  };

  this.exportLayer = function exportLayer() {
    const nodesToExport = [];
    for (let i = 0; i < this.nodes.length; i += 1) {
      // export each node and store
      nodesToExport.push(this.nodes[i].export());
    }

    return {
      nodes: nodesToExport, // return all nodes with weights and biases
    };
  };

  return this;
};

const Network = function Network() {
  this.inputLayer = null;
  this.hiddenLayers = [];
  this.outputLayer = null;

  this.init = function init(nOfInputs, nOfHiddenLayerNodes, nOfOutputs) {
    this.inputLayer = new InputLayer().init(nOfInputs);

    for (let i = 0; i < nOfHiddenLayerNodes.length; i += 1) {
      if (i === 0) { // if first hidden layer, use input layer as previous layer
        this.hiddenLayers[i] = new HiddenLayer();
        this.hiddenLayers[i].init(nOfHiddenLayerNodes[i], nOfInputs);
      } else { // if not first hidden layer, use last hidden layer as previous layer
        this.hiddenLayers[i] = new HiddenLayer();
        this.hiddenLayers[i].init(nOfHiddenLayerNodes[i], nOfHiddenLayerNodes[i - 1]);
      }
    }

    this.outputLayer = new HiddenLayer();
    this.outputLayer.init(nOfOutputs, nOfHiddenLayerNodes[nOfHiddenLayerNodes.length - 1]);

    return this;
  };

  this.forwardPropagate = function forwardPropagate(inputs) {
    const inputLayerValues = this.inputLayer.forwardPropagate(inputs);
    let lastLayerValues = [];

    for (let i = 0; i < this.hiddenLayers.length; i += 1) {
      if (i === 0) { // if first hidden layer, propagate from inputs
        lastLayerValues = this.hiddenLayers[i].forwardPropagate(inputLayerValues);
      } else {
        this.hiddenLayers[i].forwardPropagate(lastLayerValues);
      }
    }

    return this.outputLayer.forwardPropagate(lastLayerValues);
  };

  this.exportNetwork = function exportNetwork() {
    const hiddenLayersToExport = [];

    for (let i = 0; i < this.hiddenLayers.length; i += 1) {
      // store each layers export values
      hiddenLayersToExport.push(this.hiddenLayers[i].export());
    }

    // return JSON stringified object
    return JSON.stringify({
      inputLayer: this.inputLayer.export(),
      hiddenLayers: hiddenLayersToExport,
      outputLayer: this.outputLayer.export(),
    });
  };

  return this;
};

module.exports = Network;
