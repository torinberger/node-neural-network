const NOFINPUTS = 16;
const NOFHIDDENLAYERS = 2;
const NOFHIDDENLAYERNODES = 3;
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

function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

function chanceToBool(chance) {
  let choice = randomInRange(0, 100);
  return choice <= chance ? true : false;
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

const Node = function (nOfNodesInPreviousLayer) {
  this.weights = [];
  this.value = null;

  for(let i = 0; i <= nOfNodesInPreviousLayer; i += 1) {
    this.weights[i] = randomWeight();
  }

  this.propagate = function (inputs) {
    this.value = sigmoid(sumWithWeighs(inputs, this.weights));
    return this.value;
  }

  this.updatenOfNodesInPreviousLayer = function (newNodesInPreviousLayer) {
    if (newNodesInPreviousLayer > this.weights.length) {
      this.weights.push(randomWeight());
    } else if(newNodesInPreviousLayer < this.weights.length) {
      this.weights.pop();
    }
  }

  this.mutateWeight = function (weightChange) {
    let increaseWeight = chanceToBool(50);
    let selectWeight = randomInRange(0, this.weights.length - 1);
    if (increaseWeight) {
      console.log('from', this.weights[selectWeight]);
      this.weights[selectWeight] += weightChange;
      console.log('to', this.weights[selectWeight]);
    } else {
      console.log('from', this.weights[selectWeight]);
      this.weights[selectWeight] -= weightChange;
      console.log('to', this.weights[selectWeight]);
    }
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

  this.updatenOfNodesInPreviousLayer = function (newNodesInPreviousLayer) {
    for(let i = 0; i < this.nodes.length; i += 1) {
      this.nodes[i].updatenOfNodesInPreviousLayer(newNodesInPreviousLayer);
    }
  }

  this.addNode = function (nOfNodesInPreviousLayer) {
    this.nodes.push(new Node(nOfNodesInPreviousLayer));
  }

  this.removeNode = function () {
    this.nodes.pop();
  }

  return this;
}

const Network = function (nOfInputs, nOfHiddenLayers, nOfHiddenLayerNodes, nOfOutputNodes) {
  this.inputLayer = new InputLayer(nOfInputs);
  this.hiddenLayers = [];
  this.outputLayer = new HiddenLayer(nOfOutputNodes, nOfHiddenLayerNodes);

  for (var i = 0; i < nOfHiddenLayers; i++) {
    if (i === 0) { // if first hidden layer, use input layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes, nOfInputs)
    } else { // if not first hidden layer, use last hidden layer as previous layer
      this.hiddenLayers[i] = new HiddenLayer(nOfHiddenLayerNodes, this.hiddenLayers[i -1].nodes.length);
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

  this.mutate = function (layerMutateChance, nodeMutateChance, weightMutateChance, addChance, weightChange) {
    if(chanceToBool(layerMutateChance)) {
      console.log('Mutating layer');
      let addLayer = chanceToBool(addChance);
      if (addLayer) {
        console.log('adding');
        this.hiddenLayers.push(new HiddenLayer(nOfHiddenLayerNodes, this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length));
        this.outputLayer.updatenOfNodesInPreviousLayer(nOfHiddenLayerNodes);
      } else {
        console.log('removing');
        this.hiddenLayers.pop();
        this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length);
      }
    } if (chanceToBool(nodeMutateChance)) {
      console.log('Mutating node');
      let addNode = chanceToBool(addChance);
      if (addNode) {
        console.log('adding');
        let selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
        this.hiddenLayers[selectLayer].addNode(this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length);
        if (selectLayer === this.hiddenLayers.length - 1) {
          this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
        } else {
          this.hiddenLayers[selectLayer + 1].updatenOfNodesInPreviousLayer(this.hiddenLayers[selectLayer].nodes.length);
        }
      } else {
        console.log('removing');
        let selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
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
      console.log('Mutating weight');

      let selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
      let selectNode = randomInRange(0, this.hiddenLayers[selectLayer].nodes.length - 1);
      this.hiddenLayers[selectLayer].nodes[selectNode].mutateWeight(weightChange);
    }
  }

  return this;
}

const testNetwork = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);

console.log('--- Propagating Network Layers');
console.log(testNetwork.propagate([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]));
console.log(testNetwork.hiddenLayers);
for (var i = 0; i < 10000; i++) {
  testNetwork.mutate(0.05, 5, 80, 65, 0.1);
}
console.log(testNetwork.hiddenLayers);
console.log(testNetwork.propagate([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]));
