const Network = require('../../index');

const NOFINPUTS = 16;
const NOFHIDDENLAYERS = 2;
const NOFHIDDENLAYERNODES = 2;
const NOFOUTPUTS = 4;

const network1 = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);
const network2 = new Network(NOFINPUTS, NOFHIDDENLAYERS, NOFHIDDENLAYERNODES, NOFOUTPUTS);

function getGreatestMove(object, array) {
  let order = array.sort().reverse();
  for (let property in object) {
    if (object[property] == order[0]) {
      return property;
    }
  }
  // if (outputs[0] > outputs[1] && outputs[0] > outputs[2] && outputs[0] > outputs[3]) {
  //   return 'up';
  // } else if (outputs[1] > outputs[0] && outputs[1] > outputs[2] && outputs[1] > outputs[3]) {
  //   return 'right';
  // } else if (outputs[2] > outputs[1] && outputs[2] > outputs[0] && outputs[2] > outputs[3]) {
  //   return 'down';
  // } else if (outputs[3] > outputs[1] && outputs[3] > outputs[2] && outputs[3] > outputs[0]) {
  //   return 'left';
  // }
}

function getSecondGreatestMove(object, array) {
  let order = array.sort().reverse();
  for (let property in object) {
    if (object[property] == order[1]) {
      return property;
    }
  }
}

function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


let savedNet = '';
let highscore = 0;
let i = 0;

while (i < 10000) {
  i++;

  let game1 = new require('./game')();
  while (true) {
    game1.generate();
    let network1Output = network1.propagate(game1.export());
    let move = getGreatestMove({
      up: network1Output[0],
      right: network1Output[1],
      down: network1Output[2],
      left: network1Output[3],
    }, network1Output);
    let moveResult = game1.move(move);
    if (moveResult === false) {
      move = getSecondGreatestMove({
        up: network1Output[0],
        right: network1Output[1],
        down: network1Output[2],
        left: network1Output[3],
      }, network1Output);
      moveResult = game1.move(move);
    }
    if(game1.checkComplete()) {
      console.log('complete 1');
      break;
    }
  }
  let net1Score = game1.getScore();
  game1.display();

  let game2 = new require('./game')();
  while (true) {
    game2.generate();
    let network2Output = network2.propagate(game2.export());
    let move = getGreatestMove({
      up: network2Output[0],
      right: network2Output[1],
      down: network2Output[2],
      left: network2Output[3],
    }, network2Output);
    let moveResult = game2.move(move);
    if (moveResult === false) {
      move = getSecondGreatestMove({
        up: network2Output[0],
        right: network2Output[1],
        down: network2Output[2],
        left: network2Output[3],
      }, network2Output);
      moveResult = game2.move(move);
    }
    if(game2.checkComplete()) {
      console.log('complete 2');
      break;
    }
  }
  let net2Score = game2.getScore();

  console.log(net1Score, net2Score);
  if (net1Score > net2Score) {
    if (net1Score > highscore) {
      savedNet = network1.export();
      highscore = net1Score;
    }
    network2.import(network1.export());
    network2.mutate(0.0005, 0.001, 100, 65, 0.1);
  } else if(net2Score > net1Score) {
    if (net2Score > highscore) {
      savedNet = network2.export();
      highscore = net2Score;
    }
    network1.import(network2.export());
    network1.mutate(0.0005, 0.001, 100, 65, 0.1);
  } else {
    // console.log('neither superior');
    network1.mutate(0.0005, 0.001, 100, 65, 0.1);
    network2.mutate(0.0005, 0.001, 100, 65, 0.1);
  }

}

console.log('highscore', highscore);
console.log('network', network1.hiddenLayers);
console.log('highscore net', JSON.parse(savedNet).hiddenLayers);

highscore = 0;
for (let i = 0; i < 100000; i++) {
  const newGame = new require('./game')();
  while (!newGame.checkComplete()) {
    newGame.generate();
    let a = newGame.move({
      0: 'up',
      1: 'right',
      2: 'down',
      3: 'left'
    }[randomInRange(0, 3)])
    if (a === false) {
      newGame.move({
        0: 'up',
        1: 'right',
        2: 'down',
        3: 'left'
      }[randomInRange(0, 3)])
    }
  }
  if (newGame.getScore() > highscore) {
    highscore = newGame.getScore();
  }
}

console.log('chance highscore', highscore);
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
