const Mathjs = require('mathjs');
const netUtil = require('./netUtil');

/**
 * Output Node Constructor
 * Holds weights, bias and propagation functions.
 *
 * @property {Number[]} weights
 * @property {Number[]} biases
 *
 * @method init()
 * @method forwardPropagate()
 * @method importOutputNode()
 * @method exportOutputNode()
 */
const OutputNode = function OutputNode() {
  this.weights = undefined;
  this.bias = undefined;

  /**
   * Initialization
   * Instantiates output output node and generates weights and biases.
   *
   * @param {Number} nOfNodesInPreviousLayer
   *
   * @return {OutputNode}
   */
  this.init = function init(nOfNodesInPreviousLayer) {
    this.weights = [];
    this.bias = netUtil.randomWeight();
    // create weight for each node in previous layer
    for (let i = 0; i < nOfNodesInPreviousLayer; i += 1) {
      this.weights[i] = netUtil.randomWeight();
    }

    return this;
  };

  /**
   * Forward Propagate
   * Converts inputs to output by computing weights and bias.
   *
   * @param {Number[]} inputs
   *
   * @return {Number} output
   */
  this.forwardPropagate = function forwardPropagate(inputs) {
    // multiply weights by inputs, add bias and sigmoid the sum, return as output
    return netUtil.sigmoid(Mathjs.multiply(this.weights, inputs) + this.bias);
  };

  /**
   * Import Node
   * Imports JSON object to set new weights and bias.
   *
   * @param {object} newOutputNode
   *
   * @return {undefined}
   */
  this.importNode = function importNode(newOutputNode) {
    this.bias = newOutputNode.bias;
    this.weights = newOutputNode.weights;
  };

  /**
   * Export Node
   * Converts node weights and bias to JSON string.
   *
   * @return {Object}
   */
  this.exportNode = function exportNode() {
    return { // export object to be JSONified for storage
      weights: this.weights,
      bias: this.bias,
    };
  };

  return this;
};

module.exports = OutputNode;
