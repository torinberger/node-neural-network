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
  this.nOfInputs = undefined;

  /**
   * Initialization
   * Instantiates input layer and generates input nodes.
   *
   * @param {Number} nOfInputs
   *
   * @return {InputLayer}
   */
  this.init = function init(nOfInputs) {
    this.nOfInputs = nOfInputs; // set number of inputs
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
    if (inputs.length !== this.nOfInputs) {
      throw new Error('Incorrect input length');
    } else {
      return inputs; // return inputs as outputs
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
    this.nOfInputs = newInputLayer.nOfInputs;
  };

  /**
   * Export Layer
   * Converts input layer to JSON string containing all node properties.
   *
   * @return {string}
   */
  this.exportLayer = function exportLayer() {
    return {
      nOfInputs: this.nOfInputs,
    };
  };

  return this;
};

module.exports = InputLayer;

// TODO: create input node and integrate
