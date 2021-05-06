const OutputNode = require('./outputNode');

/**
 * Output Layer Constructor
 * Holds nodes aswell as propagation functions.
 *
 * @property {OutputNode[]} outputNodes
 *
 * @method init()
 * @method forwardPropagate()
 * @method importLayer()
 * @method exportLayer()
 */
const OutputLayer = function OutputLayer() {
  this.outputNodes = undefined;

  /**
   * Initialization
   * Instantiates output layer and generates nodes.
   *
   * @param {Number} nOfNodes
   * @param {Number} nOfNodesInPreviousLayer
   *
   * @return {OutputLayer}
   */
  this.init = function init(nOfNodes, nOfNodesInPreviousLayer) {
    this.outputNodes = [];
    for (let i = 0; i < nOfNodes; i += 1) {
      // create nodes and provide custom data if needed
      this.outputNodes[i] = new OutputNode().init(nOfNodesInPreviousLayer);
    }

    return this;
  };

  /**
   * Forward Propagate
   * Propagates inputs through layer to generate outputs;
   *
   * @param {Number[]} inputs
   *
   * @return {Number[]}
   */
  this.forwardPropagate = function forwardPropagate(inputs) {
    const nodeOutputs = [];
    for (let i = 0; i < this.outputNodes.length; i += 1) {
      // forward propagate each node and store their value
      nodeOutputs[i] = this.outputNodes[i].forwardPropagate(inputs);
    }

    return nodeOutputs; // return node outputs
  };

  /**
   * Import Layer
   * Imports JSON object to set new nodes along with weights and biases.
   *
   * @param {object} newInputLayer
   *
   * @return {undefined}
   */
  this.importLayer = function importLayer(newOutputLayer, nOfNodesInPreviousLayer) {
    this.outputNodes = [];
    for (let i = 0; i < newOutputLayer.nodes.length; i += 1) {
      this.outputNodes[i] = new OutputNode();
      this.outputNodes[i].importNode(newOutputLayer.nodes[i], nOfNodesInPreviousLayer);
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
    for (let i = 0; i < this.outputNodes.length; i += 1) {
      // export each node and store
      nodesToExport.push(this.outputNodes[i].exportNode());
    }

    return {
      nodes: nodesToExport, // return all nodes with weights and biases
    };
  };

  return this;
};

module.exports = OutputLayer;
