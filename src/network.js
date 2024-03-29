const Mathjs = require('mathjs');

const InputLayer = require('./input/inputLayer');
const HiddenLayer = require('./hidden/hiddenLayer');
const OutputLayer = require('./output/outputLayer');

/**
 * Network constructor
 * Holds input layer, hidden layers and output layer.
 *
 * @property {InputLayer} inputLayer
 * @property {HiddenLayer[]} hiddenLayers
 * @property {OutputLayer} outputLayer
 *
 * @method init()
 * @method forwardPropagate()
 * @method importNetwork()
 * @method exportNetwork()
 */
const Network = function Network() {
  this.inputLayer = undefined;
  this.hiddenLayers = undefined;
  this.outputLayer = undefined;

  /**
   * Initialization
   * Instantiates network and generates layers.
   *
   * @param {Number} nOfInputs
   * @param {Number[]} nOfHiddenLayerNodes
   * @param {Number} nOfOutputs
   *
   * @return {Network}
   */
  this.init = function init(nOfInputs, nOfHiddenLayerNodes, nOfOutputs) {
    this.inputLayer = new InputLayer();
    this.inputLayer.init(nOfInputs);

    this.hiddenLayers = [];
    for (let i = 0; i < nOfHiddenLayerNodes.length; i += 1) {
      if (i === 0) { // if first hidden layer, use input layer as previous layer
        this.hiddenLayers[i] = new HiddenLayer();
        this.hiddenLayers[i].init(nOfHiddenLayerNodes[i], nOfInputs);
      } else { // if not first hidden layer, use last hidden layer as previous layer
        this.hiddenLayers[i] = new HiddenLayer();
        this.hiddenLayers[i].init(nOfHiddenLayerNodes[i], nOfHiddenLayerNodes[i - 1]);
      }
    }

    // create output layer as another hidden layer
    this.outputLayer = new OutputLayer();
    this.outputLayer.init(nOfOutputs, nOfHiddenLayerNodes.last());

    return this;
  };

  /**
   * Forward Propagate
   * Propagates inputs through the network to generate an output.
   *
   * @param {Number[]} inputs
   *
   * @return {Number[]}
   */
  this.forwardPropagate = function forwardPropagate(inputs) {
    const inputLayerValues = this.inputLayer.forwardPropagate(inputs);

    let lastLayerValues = [];
    for (let i = 0; i < this.hiddenLayers.length; i += 1) {
      if (i === 0) { // if first hidden layer, propagate from inputs
        lastLayerValues = this.hiddenLayers[i].forwardPropagate(inputLayerValues);
      } else {
        lastLayerValues = this.hiddenLayers[i].forwardPropagate(lastLayerValues);
      }
    }

    return this.outputLayer.forwardPropagate(lastLayerValues);
  };

  /**
   * Determine Network Cost
   * Determines the cost of the neural network from expected outputs.
   *
   * @param {Number[][]} trainingInputs
   * @param {Number[][]} expectedOutputs
   *
   * @return {Number}
   */
  this.determineNetworkCost = function determineCost(trainingInputs, expectedOutputs) {
    const nOfTrainingRounds = trainingInputs.length;
    const costs = [];
    for (let i = 0; i < nOfTrainingRounds; i += 1) {
      const output = this.forwardPropagate(trainingInputs[i]);
      costs[i] = Mathjs.sum(Mathjs.square(Mathjs.subtract(output, expectedOutputs[i])));
    }

    return Mathjs.mean(costs);
  };

  /**
   * Determine Output Costs
   * Determines the cost of the output nodes from expected outputs.
   *
   * @param {Number[]} trainingInput
   * @param {Number[]} expectedOutput
   *
   * @return {Number[]}
   */
  this.determineOutputCosts = function determineCost(trainingInput, expectedOutput) {
    const output = this.forwardPropagate(trainingInput);
    const costs = Mathjs.square(Mathjs.subtract(output, expectedOutput));

    return costs;
  };

  /**
   * Import Network
   * Imports a JSON object to the network, replacing all layers with specified values.
   *
   * @param {Object} newNetwork
   *
   * @return {undefined}
   */
  this.importNetwork = function importNetwork(newNetwork) {
    this.inputLayer = new InputLayer();
    this.inputLayer.importLayer(newNetwork.inputLayer);

    this.hiddenLayers = []; // incase network has been initialized previously
    for (let i = 0; i < newNetwork.hiddenLayers.length; i += 1) {
      this.hiddenLayers[i] = new HiddenLayer();
      if (i === 0) {
        const nOfNodesInPreviousLayer = newNetwork.inputLayer.inputNodes.length;
        this.hiddenLayers[i].importLayer(newNetwork.hiddenLayers[i], nOfNodesInPreviousLayer);
      } else {
        const nOfNodesInPreviousLayer = newNetwork.hiddenLayers[i - 1].nodes.length;
        this.hiddenLayers[i].importLayer(newNetwork.hiddenLayers[i], nOfNodesInPreviousLayer);
      }
    }

    const nOfNodesInPreviousLayer = newNetwork.hiddenLayers.last().nodes.length;
    this.outputLayer = new OutputLayer();
    this.outputLayer.importLayer(newNetwork.outputLayer, nOfNodesInPreviousLayer);
  };

  /**
   * Export Network
   * Returns JSON string of network for importing.
   *
   * @return {string}
   */
  this.exportNetwork = function exportNetwork() {
    const hiddenLayersToExport = [];

    for (let i = 0; i < this.hiddenLayers.length; i += 1) {
      // store each layers export values
      hiddenLayersToExport.push(this.hiddenLayers[i].exportLayer());
    }

    // return JSON stringified object
    return JSON.stringify({
      inputLayer: this.inputLayer.exportLayer(),
      hiddenLayers: hiddenLayersToExport,
      outputLayer: this.outputLayer.exportLayer(),
    });
  };

  return this;
};

module.exports = Network;
