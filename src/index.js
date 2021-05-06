/* eslint-disable no-extend-native */

const Network = require('./network');

/**
 * Array.last
 * Returns last element of array.
 *
 * @return {Array[lastIndex]}
 */
Array.prototype.last = function last() {
  return this[this.length - 1];
};

module.exports = Network;
