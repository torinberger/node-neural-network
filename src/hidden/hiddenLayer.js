const Node = require('./node');

/**
 * Hidden Layer Constructor
 * Holds nodes aswell as propagation functions.
 *
 * @property {Node[]} nodes
 *
 * @method init()
 * @method forwardPropagate()
 * @method importLayer()
 * @method exportLayer()
 */
const HiddenLayer = function HiddenLayer() {
  this.nodes = undefined;

  /**
   * Initialization
   * Instantiates hidden layer and generates nodes.
   *
   * @param {Number} nOfNodes
   * @param {Number} nOfNodesInPreviousLayer
   *
   * @return {HiddenLayer}
   */
  this.init = function init(nOfNodes, nOfNodesInPreviousLayer) {
    this.nodes = [];
    for (let i = 0; i < nOfNodes; i += 1) {
      // create nodes and provide custom data if needed
      this.nodes[i] = new Node().init(nOfNodesInPreviousLayer);
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
    for (let i = 0; i < this.nodes.length; i += 1) {
      // forward propagate each node and store their value
      nodeOutputs[i] = this.nodes[i].forwardPropagate(inputs);
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
  this.importLayer = function importLayer(newHiddenLayer, nOfNodesInPreviousLayer) {
    this.nodes = [];
    for (let i = 0; i < newHiddenLayer.nodes.length; i += 1) {
      this.nodes[i] = new Node();
      this.nodes[i].importNode(newHiddenLayer.nodes[i], nOfNodesInPreviousLayer);
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
    for (let i = 0; i < this.nodes.length; i += 1) {
      // export each node and store
      nodesToExport.push(this.nodes[i].exportNode());
    }

    return {
      nodes: nodesToExport, // return all nodes with weights and biases
    };
  };

  return this;
};

module.exports = HiddenLayer;
