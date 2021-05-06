const InputNode = require('./inputNode');

/**
 * Input Layer Constructor
 * Holds input nodes aswell as propagation functions.
 *
 * @property {InputNode[]} inputNodes
 *
 * @method init()
 * @method forwardPropagate()
 * @method importLayer()
 * @method exportLayer()
 */
const InputLayer = function InputLayer() {
  this.inputNodes = undefined;

  /**
   * Initialization
   * Instantiates input layer and generates input nodes.
   *
   * @param {Number} nOfInputs
   *
   * @return {InputLayer}
   */
  this.init = function init(nOfInputs) {
    this.inputNodes = [];
    for (let i = 0; i < nOfInputs; i += 1) {
      this.inputNodes[i] = new InputNode();
      this.inputNodes[i].init();
    }

    return this;
  };

  /**
   * Forward Propagate
   * Propagates inputs through layer to produce outputs.
   *
   * @param {Number[]} inputs
   *
   * @return {Number[]}
   */
  this.forwardPropagate = function forwardPropagate(inputs) {
    if (inputs.length !== this.inputNodes.length) {
      throw new Error('Incorrect input length');
    } else {
      const inputNodeOutputs = [];
      for (let i = 0; i < this.inputNodes.length; i += 1) {
        inputNodeOutputs[i] = this.inputNodes[i].forwardPropagate(inputs[i]);
      }

      return inputNodeOutputs;
    }
  };

  /**
   * Import Layer
   * Imports JSON object to set new nodes along with weights and biases.
   *
   * @param {object} newInputLayer
   *
   * @return {undefined}
   */
  this.importLayer = function importLayer(newInputLayer) {
    this.inputNodes = [];
    for (let i = 0; i < newInputLayer.inputNodes.length; i += 1) {
      this.inputNodes[i] = new InputNode();
      this.inputNodes[i].importNode();
    }
  };

  /**
   * Export Layer
   * Converts input layer to JSON object containing all node properties.
   *
   * @return {object}
   */
  this.exportLayer = function exportLayer() {
    const nodesToExport = [];
    for (let i = 0; i < this.inputNodes.length; i += 1) {
      // export each node and store
      nodesToExport.push(this.inputNodes[i].exportNode());
    }

    return {
      inputNodes: nodesToExport,
    };
  };

  return this;
};

module.exports = InputLayer;
