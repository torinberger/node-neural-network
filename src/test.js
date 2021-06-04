const Mathjs = require('mathjs');

const NN = require('./new');
const nn = new NN(60, [20, 10], 4);

const TRAININGROUNDS = 10000000;
const TRAINGINWEIGHT = 0.1;

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// let guessData = Array(60);
// for (let n = 0; n < guessData.length; n++) {
//   guessData[n] = guessData[n] === undefined ? 0 : guessData[n];
// }
// let output = nn.forwardPropagate(guessData);
// console.log('output', output);
//
// nn.backPropagate(guessData, [0,0,0,0], 0.1);
//
// output = nn.forwardPropagate(guessData);
// console.log('output', output);

let lastwin = 0;

for (let i = 0; i < TRAININGROUNDS; i++) {
  let otherNumberPick = [randomNumber(1, 9), randomNumber(0, 9), randomNumber(0, 9), randomNumber(0, 9)];
  // console.log('number to guess', otherNumberPick);
  let guessData = Array(60);
  for (let n = 0; n < guessData.length; n++) {
    guessData[n] = guessData[n] === undefined ? 0 : guessData[n];
  }

  for (let n = 0; n < 10; n++) {
    let output = nn.forwardPropagate(guessData);
    // console.log('output', output);
    output = output.map(x => Math.round(x * 10));

    let bulls = 0;
    let cows = 0;
    for (var k = 0; k < 4; k++) {
      if (output[k] === otherNumberPick[k]) {
        bulls += 1;
      } else if (otherNumberPick.indexOf(output[k]) > -1) {
        cows += 1;
      }
    }

    if (bulls === 4) {
      console.log('won', i - lastwin);
      lastwin = i;
      break;
    }

    guessData[(n*6)] = output[0] / 10;
    guessData[(n*6)+1] = output[1] / 10;
    guessData[(n*6)+2] = output[2] / 10;
    guessData[(n*6)+3] = output[3] / 10;
    guessData[(n*6)+4] = bulls / 10;
    guessData[(n*6)+5] = cows / 10;

    // console.log(guessData, otherNumberPick.map(x => x / 10));
    nn.backPropagate(guessData, otherNumberPick.map(x => x / 10), 0.001);
  }
}
