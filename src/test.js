const NN = require('./new');
const nn = new NN(2, [3, 2], 2);

console.log(nn.forwardPropagate([1,1]));
console.log(nn.backPropagate([1,1], [1, 0], 0.5));
console.log(nn.forwardPropagate([1,1]));
// console.log(nn.deltaActivations);
// console.log(nn.deltaWeights);
// console.log(nn.deltaBiases);
