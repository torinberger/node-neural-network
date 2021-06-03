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

    for (let i = 0; i < this.nOfLayers; i++) {
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

    this.resetDeltas();
  }

  resetDeltas() {
    this.deltaWeights = [];
    this.deltaBiases = [];
    this.deltaActivations = [];

    for (let i = 0; i < this.nOfLayers; i++) {
      this.deltaWeights[i] = [];
      this.deltaBiases[i] = [];
      this.deltaActivations[i] = [];
      let nOfNodesInLayer = i === this.nOfLayers ? this.nOfOutputs : this.nOfNodesInLayers[i];
      for (let n = 0; n < nOfNodesInLayer; n++) {
        this.deltaWeights[i][n] = [];
        this.deltaBiases[i][n] = 0;
        this.deltaActivations[i][n] = 0;
        let nOfNodesInPreviousLayer = i === 0 ? this.nOfInputs : this.nOfNodesInLayers[i - 1];
        for (let k = 0; k < nOfNodesInPreviousLayer; k++) {
          this.deltaWeights[i][n][k] = 0;
        }
      }
    }
  }

  applyDeltas(trainingWeight) {
    for (let i = 0; i < this.nOfLayers; i++) {
      let nOfNodesInLayer = i === this.nOfLayers ? this.nOfOutputs : this.nOfNodesInLayers[i];
      for (let n = 0; n < nOfNodesInLayer; n++) {
        this.biases[i][n] -= this.deltaBiases[i][n] * trainingWeight;
        console.log('changing bias', this.biases[i][n], 'by', this.deltaBiases[i][n]);
        let nOfNodesInPreviousLayer = i === 0 ? this.nOfInputs : this.nOfNodesInLayers[i - 1];
        for (let k = 0; k < nOfNodesInPreviousLayer; k++) {
          console.log('changing weight', this.weights[i][n][k], 'by', this.deltaWeights[i][n][k]);
          this.weights[i][n][k] -= this.deltaWeights[i][n][k] * trainingWeight;
        }
      }
    }
  }

  forwardPropagate(inputs) {
    if (inputs.length !== this.nOfInputs) { throw 'Incorrect input length'; }

    this.zs = [];
    this.as = [];
    for (let i = 0; i < this.nOfLayers; i++) {
      let lastLayerValues = i === 0 ? inputs : this.as[i - 1];
      let zs = Mathjs.add(Mathjs.multiply(this.weights[i], lastLayerValues), this.biases[i]);
      let as = Array.from(zs, (x) => sigmoid(x));
      this.zs.push(zs);
      this.as.push(as);
    }

    return this.as[this.as.length - 1];
  }

  backPropagate(inputs, expectedOutputs, trainingWeight) {
    if (inputs.length !== this.nOfInputs) { throw 'Incorrect input length'; }
    if (expectedOutputs.length !== this.nOfOutputs) { throw 'Incorrect output length'; }

    this.resetDeltas();
    let propagation = this.forwardPropagate(inputs);
    // console.log('forward prop', propagation);

    for (let layer = this.nOfLayers - 1; layer > -1; layer--) {
      // console.log('loop layer', layer);

      for (let currentNode = 0; currentNode < this.nOfNodesInLayers[layer]; currentNode++) {
        // console.log('loop current node', currentNode);

        let sigmoidDerivativeOfZ = sigmoidDerivative(this.zs[layer][currentNode]);
        let costDerivative;
        if (layer === this.nOfLayers - 1) {
          costDerivative = 2 * (propagation[currentNode] - expectedOutputs[currentNode]);
          this.deltaActivations[layer][currentNode] = costDerivative;
        } else {
          costDerivative = this.deltaActivations[layer][currentNode];
        }

        this.deltaBiases[layer][currentNode] = sigmoidDerivativeOfZ * costDerivative;

        if (layer === 0) {
          for (let nextLayerNode = 0; nextLayerNode < this.nOfInputs; nextLayerNode++) {
            // console.log('loop next layer input node', nextLayerNode);
            let weight = this.weights[layer][currentNode][nextLayerNode];

            this.deltaWeights[layer][currentNode][nextLayerNode] = inputs[nextLayerNode] * sigmoidDerivativeOfZ * costDerivative;
          }
        } else {
          for (let nextLayerNode = 0; nextLayerNode < this.nOfNodesInLayers[layer - 1]; nextLayerNode++) {
            // console.log('loop next layer node', nextLayerNode);
            let weight = this.weights[layer][currentNode][nextLayerNode];

            this.deltaActivations[layer - 1][nextLayerNode] += weight * sigmoidDerivativeOfZ * costDerivative;
            this.deltaWeights[layer][currentNode][nextLayerNode] = this.as[layer - 1][nextLayerNode] * sigmoidDerivativeOfZ * costDerivative;
          }
        }
      }
    }

    this.applyDeltas(trainingWeight);
  }
}

module.exports = Network;
