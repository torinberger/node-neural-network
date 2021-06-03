const Mathjs = require('mathjs');

const NN = require('./new');
const nn = new NN(3, [2], 2);

const TRAININGROUNDS = 1000;
const TRAINGINWEIGHT = 0.1;

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

for (var i = 0; i < TRAININGROUNDS; i++) {
  let choice = randomNumber(0, 2);
  let input = [0,0,0];
  input[choice] = 1;
  let expectedOutput = [0, 0];
  if (choice === 0 || choice === 2) {
    expectedOutput[1] = 1;
  } else { expectedOutput[0] = 1; }

  if (i % 10 === 0) {
    let o = nn.forwardPropagate(input);
    console.log(Mathjs.mean(Mathjs.subtract(o, expectedOutput)));
  }

  nn.backPropagate(input, expectedOutput, TRAINGINWEIGHT);
}

console.log('bush', nn.forwardPropagate([1, 0, 0]));
console.log('bird', nn.forwardPropagate([0, 1, 0]));
console.log('log', nn.forwardPropagate([0, 0, 1]));
console.log(nn.weights);
// console.log(nn.forwardPropagate([1,1]));
// console.log(nn.backPropagate([1,1], [1, 0], 0.5));
// console.log(nn.forwardPropagate([1,1]));
