const Mathjs = require('mathjs');

function sigmoid(t) {
  return 1 / (1 + Math.E**(-t));
}

function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

function chanceToBool(chance) {
  return Math.random() * (100 - 0) + 0 <= chance;
}

const InputLayer = function () {
  this.forwardPropagate = function (inputs) {
    return inputs; // return inputs as outputs
  };

  return this;
};

const Node = function (nOfNodesInPreviousLayer) {
  this.weights = [];
  this.bias = 0;

  this.init = function (nOfNodesInPreviousLayer, customWeights, customBias) {
    this.weights = [];
    // set bias to custom value if required otherwise set to random value
    this.bias = customBias !== undefined ? customBias : randomWeight();
    for (let i = 0; i < nOfNodesInPreviousLayer; i += 1) {
      // add weight equal to custom weights provided or a randomly generated weight
      this.weights[i] = customWeights !== undefined ? customWeights[i] : randomWeight();
    }

    return this;
  };

  this.forwardPropagate = function (inputs) {
    // multiply weights by inputs, add bias and sigmoid the sum, return as output
    return sigmoid(Mathjs.multiply(this.weights, inputs) + this.bias);
  };

  this.export = function () {
    return { // export object to be JSONified for storage
      weights: this.weights,
      bias: this.bias,
    };
  };

  return this;
};

const HiddenLayer = function () {
  this.nodes = [];

  this.init = function (nOfNodes, nOfNodesInPreviousLayer, customNodeWeights, customNodeBiases) {
    this.nodes = [];
    for (let i = 0; i < nOfNodes; i += 1) {
      // create nodes and provide custom data if needed
      this.nodes[i] = new Node().init(nOfNodesInPreviousLayer, customNodeWeights[i], customNodeBiases[i]);
    }

    return this;
  };

  this.forwardPropagate = function (inputs) {
    const nodeOutputs = [];
    for (let i = 0; i < this.nodes.length; i += 1) {
      nodeOutputs[i] = nodes[i].forwardPropagate(inputs); // forward propagate each node and store their value
    }
    return nodeOutputs; // return node outputs
  };

  this.export = function () {
    const nodesToExport = [];
    for (let i = 0; i < this.nodes.length; i++) {
      nodesToExport.push(this.nodes[i].export()); // export each node and store
    }

    return {
      nodes: nodesToExport, // return all nodes with weights and biases
    };
  };

  return this;
};

const Network = function (nOfInputs, nOfHiddenLayers, nOfHiddenLayerNodes, nOfOutputNodes) {
  this.inputLayer = new InputLayer();
  this.hiddenLayers = [];
  this.outputLayer = new HiddenLayer().init(nOfOutputNodes, nOfHiddenLayerNodes[nOfHiddenLayers - 1]);

  for (let i = 0; i < nOfHiddenLayers; i++) {
    if (i === 0) { // if first hidden layer, use input layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes, nOfInputs);
    } else { // if not first hidden layer, use last hidden layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes, this.hiddenLayers[i - 1].nodes.length);
    }
  }

  this.propagate = function (inputs) {
    const inputLayerValues = this.inputLayer.propagate(inputs);
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      if (i === 0) { // if first hidden layer
        this.hiddenLayers[i].propagate(inputLayerValues);
      } else {
        this.hiddenLayers[i].propagate(this.hiddenLayers[i - 1].getNodeValues());
      }
    }
    const outputLayerValues = this.outputLayer.propagate(this.hiddenLayers[this.hiddenLayers.length - 1].getNodeValues());
    return outputLayerValues;
  };

  this.mutate = function (layerMutateChance, nodeMutateChance, weightMutateChance, addChance, weightChange) {
    if (chanceToBool(layerMutateChance)) {
      const addLayer = chanceToBool(addChance);
      if (addLayer) {
        this.hiddenLayers.push(new HiddenLayer(nOfHiddenLayerNodes, this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length));
        this.outputLayer.updatenOfNodesInPreviousLayer(nOfHiddenLayerNodes);
      } else if (this.hiddenLayers.length > 2) {
        this.hiddenLayers.pop();
        this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length);
      }
    } if (chanceToBool(nodeMutateChance)) {
      const addNode = chanceToBool(addChance);
      if (addNode) {
        const selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
        if (selectLayer === this.hiddenLayers.length - 1) {
          this.hiddenLayers[selectLayer].addNode(this.hiddenLayers[selectLayer - 1].nodes.length);
          this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
        } else if (selectLayer === 0) {
          this.hiddenLayers[selectLayer].addNode(this.inputLayer.inputNodes.length);
          this.hiddenLayers[selectLayer + 1].updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
        } else {
          this.hiddenLayers[selectLayer].addNode(this.hiddenLayers[selectLayer - 1].nodes.length);
          this.hiddenLayers[selectLayer + 1].updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
        }
      } else {
        const selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
        if (this.hiddenLayers[selectLayer].nodes.length > 1) {
          this.hiddenLayers[selectLayer].removeNode();
          if (selectLayer === this.hiddenLayers.length - 1) {
            this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
          } else {
            this.hiddenLayers[selectLayer + 1].updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
          }
        }
      }
    } if (chanceToBool(weightMutateChance)) {
      const selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
      const selectNode = randomInRange(0, this.hiddenLayers[selectLayer].nodes.length - 1);
      this.hiddenLayers[selectLayer].nodes[selectNode].mutateWeight(weightChange);
    }
  };

  this.export = function () {
    const hiddenLayersToExport = [];
    for (let i = 0; i < this.hiddenLayers.length; i++) {
      hiddenLayersToExport.push(this.hiddenLayers[i].export());
    }
    return JSON.stringify({
      inputLayer: this.inputLayer.export(),
      hiddenLayers: hiddenLayersToExport,
      outputLayer: this.outputLayer.export(),
    });
  };

  this.import = function (jsonData) {
    const importData = JSON.parse(jsonData);

    this.inputLayer.import(importData.inputLayer.nodes);
    this.hiddenLayers = [];
    for (let i = 0; i < importData.hiddenLayers.length; i++) {
      this.hiddenLayers[i] = new HiddenLayer(0, 0);
      this.hiddenLayers[i].import(importData.hiddenLayers[i].nodes);
    }
    this.outputLayer.import(importData.outputLayer.nodes);
  };

  return this;
};

module.exports = Network;
