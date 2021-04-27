const Network = require('../../index');

const NOFINPUTS = 16;
const NOFHIDDENLAYERS = 2;
const NOFHIDDENLAYERNODES = 2;
const NOFOUTPUTS = 4;

const network1 = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);
const network2 = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);

// console.log('--- Mutating Network ---');
// var start = new Date();
// for (var i = 0; i < NOFMUTATIONS; i++) {
//   testNetwork.mutate(0.005, 0.1, 100, 65, 0.1);
//   if (i % 10000000 === 0) {
//     var end = new Date();
//     let ms = end - start;
//     console.log('10000000 Mutations took', ms, 'ms');
//     start = new Date();
//   } else if (i % 1000000 === 0) {
//     console.log('-- Mutation Loop',i,'--');
//     let result = testNetwork.propagate([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
//   }
// }

function getGreatestMove(outputs) {
  if (outputs[0] > outputs[1] && outputs[0] > outputs[2] && outputs[0] > outputs[3]) {
    return 'up';
  } else if (outputs[1] > outputs[0] && outputs[1] > outputs[2] && outputs[1] > outputs[3]) {
    return 'right';
  } else if (outputs[2] > outputs[1] && outputs[2] > outputs[0] && outputs[2] > outputs[3]) {
    return 'down';
  } else if (outputs[3] > outputs[1] && outputs[3] > outputs[2] && outputs[3] > outputs[0]) {
    return 'left';
  }
}

let savedNet = '';

while (true) {

  let game1 = new require('./game')();
  while (true) {
    game1.generate();
    game1.display();
    let network1Output = network1.propagate(game1.export());
    console.log(network1Output);
    let move = getGreatestMove(network1Output);
    // console.log(game1.export());
    console.log('net1 move');
    console.log(move, game1.getScore());
    game1.move(move);
    if(game1.checkComplete() || game1.checkFull()) {
      // console.log(game1.getScore());
      break;
    }
  }
  let net1Score = game1.getScore();

  let game2 = new require('./game')();
  console.log('new game 2');
  game2.display();
  while (true) {
    game2.generate();
    // game2.display();
    let network2Output = network2.propagate(game2.export());
    console.log(network2Output);
    let move = getGreatestMove(network2Output);
    // console.log(game1.export());
    console.log('net2 move');
    console.log(move, game2.getScore());
    game2.move(move);
    if(game2.checkComplete() || game2.checkFull()) {
      // console.log(game2.getScore());
      break;
    }
  }
  let net2Score = game2.getScore();

  console.log('scores', net1Score, net2Score);
  if (net1Score > net2Score) {
    console.log('net1 superior');
    network2.import(network1.export());
    network2.mutate(0.005, 80, 100, 65, 0.05);
  } else if(net2Score > net1Score) {
    console.log('net2 superior');
    network1.import(network2.export());
    network1.mutate(0.005, 80, 100, 65, 0.05);
  } else {
    // console.log('neither superior');
    network1.mutate(0.005, 80, 100, 65, 0.05);
    network2.mutate(0.005, 80, 100, 65, 0.05);
  }

}


// for (var i = 0; i < 60; i++) {
//   gameState.generate();
//   gameState.display();
//   gameState.move(options[i % 4]);
//   if(gameState.checkComplete()) {
//     console.log(gameState.getScore());
//     break;
//   }
// }
//
// console.log('network 1 hidden layers');
// console.log(network1.hiddenLayers);
// network1.mutate(0.005, 80, 100, 65, 0.1);
// console.log('mutated network', network1.hiddenLayers);
// let save = network1.export();
// network2.import(save);
// console.log('imported new network', network2.hiddenLayers);
