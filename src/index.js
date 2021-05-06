/* eslint-disable no-extend-native */

/**
 * Array.last
 * Returns last element of array.
 *
 * @return {Array[lastIndex]}
 */
Array.prototype.last = function last() {
  return this[this.length - 1];
};

const Network = require('./network');

module.exports = Network;
