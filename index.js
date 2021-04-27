
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

// function randomWeight() {
//   return (Math.round((Math.random() * (1 - (-1)) + -1) * 100) / 1000) + 1;
// }

function chanceToBool(chance) {
  return Math.random() * (100 - 0) + 0 <= chance ? true : false;
}

const InputNode = function () {
  this.value = null;
  this.propagate = function(input) {
    // this.value = sigmoid(input);
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

  this.export = function () {
    return {
      nodes: this.inputNodes.length,
    };
  }

  this.import = function (nOfNodes) {
    this.inputNodes = [];
    for(let i = 0; i < nOfNodes; i += 1) {
      this.inputNodes[i] = new InputNode();
    }
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
    let difference = newNodesInPreviousLayer - this.weights.length;
    if (difference > 0) {
      for (var i = 0; i < difference; i++) {
        this.weights.push(randomWeight());
      }
    } else if (difference < 0) {
      for (var i = 0; i < (-difference); i++) {
        this.weights.pop();
      }
    }
  }

  this.mutateWeight = function (weightChange) {
    let increaseWeight = chanceToBool(50);
    let selectWeight = randomInRange(0, this.weights.length - 1);
    if (increaseWeight) {
      this.weights[selectWeight] += weightChange;
    } else {
      this.weights[selectWeight] -= weightChange;
    }
  }

  this.export = function () {
    return {
      weights: this.weights
    };
  }

  this.import = function (weights) {
    this.weights = [];

    for(let i = 0; i < weights.length; i += 1) {
      this.weights[i] = weights[i];
    }
  }

  return this;
}

const HiddenLayer = function (nOfNodes, nOfNodesInPreviousLayer) {
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

  this.export = function () {
    let nodesToExport = [];
    for (var i = 0; i < this.nodes.length; i++) {
      nodesToExport.push(this.nodes[i].export());
    }

    return {
      nodes: nodesToExport,
    };
  }

  this.import = function (nodes) {
    this.nodes = [];

    for (var i = 0; i < nodes.length; i++) {
      this.nodes[i] = new Node(0);
      this.nodes[i].import(nodes[i].weights);
    }
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
      let addLayer = chanceToBool(addChance);
      if (addLayer) {
        this.hiddenLayers.push(new HiddenLayer(nOfHiddenLayerNodes, this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length));
        this.outputLayer.updatenOfNodesInPreviousLayer(nOfHiddenLayerNodes);
      } else {
        if (this.hiddenLayers.length > 2) {
          this.hiddenLayers.pop();
          this.outputLayer.updatenOfNodesInPreviousLayer(this.hiddenLayers[this.hiddenLayers.length - 1].nodes.length);
        }
      }
    } if (chanceToBool(nodeMutateChance)) {
      let addNode = chanceToBool(addChance);
      if (addNode) {
        let selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
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
      let selectLayer = randomInRange(0, this.hiddenLayers.length - 1);
      let selectNode = randomInRange(0, this.hiddenLayers[selectLayer].nodes.length - 1);
      this.hiddenLayers[selectLayer].nodes[selectNode].mutateWeight(weightChange);
    }
  }

  this.export = function () {
    let hiddenLayersToExport = [];
    for (var i = 0; i < this.hiddenLayers.length; i++) {
      hiddenLayersToExport.push(this.hiddenLayers[i].export());
    }
    return JSON.stringify({
      inputLayer: this.inputLayer.export(),
      hiddenLayers: hiddenLayersToExport,
      outputLayer: this.outputLayer.export()
    });
  }

  this.import = function (jsonData) {
    let importData = JSON.parse(jsonData);

    this.inputLayer.import(importData.inputLayer.nodes);
    this.hiddenLayers = [];
    for (var i = 0; i < importData.hiddenLayers.length; i++) {
      this.hiddenLayers[i] = new HiddenLayer(0, 0);
      this.hiddenLayers[i].import(importData.hiddenLayers[i].nodes);
    }
    this.outputLayer.import(importData.outputLayer.nodes);
  }

  return this;
}

module.exports = Network;
