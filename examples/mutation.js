const Network = require('../index');

const NOFINPUTS = 16;
const NOFHIDDENLAYERS = 2;
const NOFHIDDENLAYERNODES = 3;
const NOFOUTPUTS = 4;

const NOFMUTATIONS = 10000000;

const testNetwork = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);

console.log('--- Mutating Network ---');
let start = new Date();
for (let i = 0; i < NOFMUTATIONS; i++) {
  testNetwork.mutate(0.005, 0.1, 100, 65, 0.1);
  if (i % 10000000 === 0) {
    const end = new Date();
    const ms = end - start;
    console.log('10000000 Mutations took', ms, 'ms');
    start = new Date();
  } else if (i % 1000000 === 0) {
    console.log('-- Mutation Loop', i, '--');
    const result = testNetwork.propagate([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  }
}

console.log(testNetwork.hiddenLayers);
