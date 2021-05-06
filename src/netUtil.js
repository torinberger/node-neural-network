/**
 * Sigmoid
 * Activation function converts integer to value between 0-1.
 *
 * @param {Number} input
 *
 * @return {Number} output
 */
function sigmoid(t) {
  return 1 / (1 + Math.E ** (-t));
}

/**
 * Random In Range
 * Generates random number in range of min to max.
 *
 * @param {Number} min
 * @param {Number} max
 *
 * @return {Number}
 */
function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Random Weights
 * Generates random number in range of -1 to 1.
 *
 * @return {Number}
 */
function randomWeight() {
  return Math.random() * (1 - (-1)) + -1;
}

/**
 * Chance To Bool
 * Returns boolean value dependent on chance provided.
 *
 * @param {Number} chance (between 0 to 100)
 *
 * @return {Boolean}
 */
function chanceToBool(chance) {
  return Math.random() * (100 - 0) + 0 <= chance;
}

module.exports = {
  sigmoid,
  randomWeight,
  randomInRange,
  chanceToBool,
};
