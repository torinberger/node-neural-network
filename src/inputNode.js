/**
 * Input Node Constructor
 * Holds propagation functions.
 *
 * @method init()
 * @method forwardPropagate()
 * @method importNode()
 * @method exportNode()
 */
const InputNode = function InputNode() {
  /**
   * Initialization
   * Instantiates node.
   *
   * @return {Node}
   */
  this.init = function init() {
    return this;
  };

  /**
   * Forward Propagate
   * Returns input.
   *
   * @param {Number} input
   *
   * @return {Number}
   */
  this.forwardPropagate = function forwardPropagate(input) {
    return input;
  };

  /**
   * Import Node
   * Imports JSON object.
   *
   * @param {object} newNode
   *
   * @return {null}
   */
  this.importNode = function importNode() {
    return null;
  };

  /**
   * Export Node
   * Converts node values to JSON string.
   *
   * @return {Object}
   */
  this.exportNode = function exportNode() {
    return {};
  };

  return this;
};

module.exports = InputNode;
