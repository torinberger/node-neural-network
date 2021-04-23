const NOFINPUTS = 16;
const NOFHIDDENLAYERS = 1;
const NOFHIDDENLAYERNODES = [3];
const NOFOUTPUTS = 4;

function sigmoid(t) {
  return 1/(1+Math.pow(Math.E, -t));
}

function sumWithWeighs(inputs, weights) {
  let count = 0;
  for(let i = 0; i < inputs.length; i++) {
    count += inputs[i] * weights[i];
  }
  return count;
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

const InputNode = function () {
  this.value = null;
  this.propagate = function(input) {
    this.value = sigmoid(input);
    return this.value;
  }

  return this;
}

const InputLayer = function (nOfInputs) {
  this.inputNodes = [];
  for(let i = 0; i < nOfInputs; i += 1) {
    this.inputNodes[i] = new InputNode();
  }

  this.getNodeValues = function () {
    let values = [];
    for (var i = 0; i < this.inputNodes.length; i++) {
      values[i] = this.inputNodes[i].value;
    }

    return values;
  }

  this.propagate = function (inputs) {
    for(let i = 0; i < inputs.length; i+= 1) {
      this.inputNodes[i].propagate(inputs[i]);
    }

    return this.getNodeValues();
  }

  return this;
}

const Node = function (nOfNodesInLastLayer) {
  this.weights = [];
  this.value = null;

  for(let i = 0; i <= nOfNodesInLastLayer; i += 1) {
    this.weights[i] = randomWeight();
  }

  this.propagate = function (inputs) {
    this.value = sigmoid(sumWithWeighs(inputs, this.weights));
    return this.value;
  }

  return this;
}

const HiddenLayer = function (nOfNodes, nOfNodesInPreviousLayer) {
  this.nOfNodes = nOfNodes;
  this.nodes = [];

  for(let i = 0; i < nOfNodes; i += 1) {
    this.nodes[i] = new Node(nOfNodesInPreviousLayer);
  }

  this.getNodeValues = function () {
    let values = [];
    for (var i = 0; i < this.nodes.length; i++) {
      values[i] = this.nodes[i].value;
    }

    return values;
  }

  this.propagate = function(inputs) {
    for(let i = 0; i < this.nodes.length; i += 1) {
      this.nodes[i].propagate(inputs);
    }

    return this.getNodeValues();
  }

  return this;
}

const Network = function (nOfInputs, nOfHiddenLayers, nOfHiddenLayerNodes, nOfOutputNodes) {
  this.inputLayer = new InputLayer(nOfInputs);
  this.hiddenLayers = [];
  this.outputLayer = new HiddenLayer(nOfOutputNodes, nOfHiddenLayerNodes[nOfHiddenLayerNodes.length - 1]);

  for (var i = 0; i < nOfHiddenLayers; i++) {
    if (i === 0) { // if first hidden layer, use input layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes[i], nOfInputs)
    } else { // if not first hidden layer, use last hidden layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes[i], nOfHiddenLayerNodes[i-1]);
    }
  }

  this.propagate = function (inputs) {
    let inputLayerValues = this.inputLayer.propagate(inputs);
    for (var i = 0; i < this.hiddenLayers.length; i++) {
      if (i === 0) { // if first hidden layer
        this.hiddenLayers[i].propagate(inputLayerValues);
      } else {
        this.hiddenLayers[i].propagate(this.hiddenLayers[i - 1].getNodeValues())
      }
    }
    let outputLayerValues = this.outputLayer.propagate(this.hiddenLayers[this.hiddenLayers.length - 1].getNodeValues());
    return outputLayerValues;
  }

  return this;
}

const testNetwork = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);

console.log('--- Propagating Network Layers');
console.log(testNetwork.propagate([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]));
