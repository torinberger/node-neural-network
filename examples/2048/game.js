
function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function chanceToBool(chance) {
  return Math.random() * (100 - 0) + 0 <= chance ? true : false;
}

/*

Gamestate item values:

0 = empty
0.1 = 2
0.2 = 4
0.3 = 8
0.4 = 16
0.6 = 32
0.5 = 64
0.6 = 128
0.7 = 256
0.8 = 512
0.9 = 1024
1.0 = 2048

>i -> down
<i -> up
>n -> right
<n -> left

*/

const scoreMatrix = {
  '0': 0,
  '0.1': 2,
  '0.2': 4,
  '0.3': 8,
  '0.4': 16,
  '0.6': 32,
  '0.5': 64,
  '0.6': 128,
  '0.7': 256,
  '0.8': 512,
  '0.9': 1024,
  '1.0': 2048
}

const GameState = function () {
  this.gameState = [];
  this.score = 0;
  this.lastMove = '';

  for (var i = 0; i < 4; i++) {
    this.gameState[i] = [];
    for (var n = 0; n < 4; n++) {
      this.gameState[i][n] = 0;
    }
  }

  this.checkComplete = function () {
    for (var i = 0; i < 4; i++) {
      for (var n = 0; n < 4; n++) {
        if (this.gameState[i][n] === 0) {
          return false;
        } else if (i > 0 && this.gameState[i][n] > 0) {
          if (this.gameState[i - 1][n] === this.gameState[i][n] || this.gameState[i - 1][n] === 0) {
            return false;
          }
        } else if (n < 3 && this.gameState[i][n] > 0) {
          if (this.gameState[i][n + 1] === this.gameState[i][n] || this.gameState[i][n + 1] === 0) {
            return false;
          }
        } else if (i < 3 && this.gameState[i][n] > 0) {
          if (this.gameState[i + 1][n] === this.gameState[i][n] || this.gameState[i + 1][n] === 0) {
            return false;
          }
        } else if (n > 0 && this.gameState[i][n] > 0) {
          if (this.gameState[i][n - 1] === this.gameState[i][n] || this.gameState[i][n - 1] === 0) {
            return false;
          }
        }
      }
    }

    return true;
  }

  this.checkFull = function () {
    for (var i = 0; i < 4; i++) {
      for (var n = 0; n < 4; n++) {
        if (this.gameState[i][n] === 0) {
          return false;
        }
      }
    }

    return true;
  }

  this.generate = function () {
    while (true) {
      if (this.checkFull()) {
        return true;
      } else {
        let x = randomInRange(0, 3);
        let y = randomInRange(0, 3);
        if (this.gameState[x][y] === 0) {
          this.gameState[x][y] = 0.1 + (Number(chanceToBool(25)) * 0.1);
          return false;
        }
      }
    }
  }

  this.move = function (direction) {
    if (this.lastMove === direction) {
      return false;
    } else {
      this.lastMove = direction;
    }

    if (direction === 'up') {
      // console.log('moving up');
      // progresses down then right
      while (true) {
        let changed = false;
        for (var n = 0; n < 4; n++) {
          for (var i = 0; i < 4; i++) {
            if (i > 0 && this.gameState[i][n] > 0 && this.gameState[i][n] !== 1) {
              if (this.gameState[i - 1][n] === this.gameState[i][n] && typeof this.gameState[i][n] !== 'string') { // combine
                this.gameState[i - 1][n] = Math.round((this.gameState[i - 1][n] + 0.1) * 10) / 10;
                this.score += scoreMatrix[String(this.gameState[i - 1][n])];
                this.gameState[i - 1][n] = String(this.gameState[i - 1][n]); // set to string so they cant combine again
                this.gameState[i][n] = 0;
                changed = true;
              } else if(this.gameState[i - 1][n] === 0) {
                this.gameState[i - 1][n] += this.gameState[i][n];
                this.gameState[i][n] = 0;
                changed = true;
              }
            }
          }
        }
        if (!changed) {
          break;
        }
      }
    } else if (direction === 'right') {
      // console.log('moving right');
      // progresses left then down
      while (true) {
        let changed = false;
        for (var i = 0; i < 4; i++) {
          for (var n = 3; n > -1; n--) {
            if (n < 3 && this.gameState[i][n] > 0 && this.gameState[i][n] !== 1) {
              if (this.gameState[i][n + 1] === this.gameState[i][n] && typeof this.gameState[i][n] !== 'string') {
                this.gameState[i][n + 1] = Math.round((this.gameState[i][n + 1] + 0.1) * 10) / 10;
                this.score += scoreMatrix[String(this.gameState[i][n + 1])];
                this.gameState[i][n + 1] = String(this.gameState[i][n + 1]);
                this.gameState[i][n] = 0;
                changed = true;
              } else if (this.gameState[i][n + 1] === 0) {
                this.gameState[i][n + 1] += this.gameState[i][n];
                this.gameState[i][n] = 0;
                changed = true;
              }
            }
          }
        }
        if (!changed) {
          break;
        }
      }
    }  else if (direction === 'down') {
      // console.log('moving down');
      // progresses up then right
      while (true) {
        let changed = false;
        for (var n = 0; n < 4; n++) {
          for (var i = 3; i > -1; i--) {
            if (i < 3 && this.gameState[i][n] > 0 && this.gameState[i][n] !== 1) {
              if (this.gameState[i + 1][n] === this.gameState[i][n] && typeof this.gameState[i][n] !== 'string') {
                this.gameState[i + 1][n] = Math.round((this.gameState[i + 1][n] + 0.1) * 10) / 10;
                this.score += scoreMatrix[String(this.gameState[i + 1][n])];
                this.gameState[i + 1][n] = String(this.gameState[i + 1][n]);
                this.gameState[i][n] = 0;
                changed = true;
              } else if (this.gameState[i + 1][n] === 0) {
                this.gameState[i + 1][n] += this.gameState[i][n];
                this.gameState[i][n] = 0;
                changed = true;
              }
            }
          }
        }
        if (!changed) {
          break;
        }
      }
    } else if (direction === 'left') {
      // console.log('moving left');
      // progresses right then down
      while (true) {
        let changed = false;
        for (var i = 0; i < 4; i++) {
          for (var n = 0; n < 4; n++) {
            if (n > 0 && this.gameState[i][n] > 0 && this.gameState[i][n] !== 1) {
              if (this.gameState[i][n - 1] === this.gameState[i][n] && typeof this.gameState[i][n] !== 'string') {
                this.gameState[i][n - 1] = Math.round((this.gameState[i][n - 1] + 0.1) * 10) / 10;
                this.score += scoreMatrix[String(this.gameState[i][n - 1])];
                this.gameState[i][n - 1] = String(this.gameState[i][n - 1]);
                this.gameState[i][n] = 0;
                changed = true;
              } else if (this.gameState[i][n - 1] === 0) {
                this.gameState[i][n - 1] += this.gameState[i][n];
                this.gameState[i][n] = 0;
                changed = true;
              }
            }
          }
        }
        if (!changed) {
          break;
        }
      }
    }

    for (var i = 0; i < 4; i++) {
      for (var n = 0; n < 4; n++) {
        this.gameState[i][n] = Number(this.gameState[i][n]);
      }
    }
  }

  this.getScore = function () {
    return this.score;
  }

  this.display = function () {
    console.log(' --- Game State ---');
    for (var i = 0; i < 4; i++) {
      let line = '';
      for (var n = 0; n < 4; n++) {
        line += `${gameState[i][n]}`
        for (var k = 0; k < (4 - String(gameState[i][n]).length); k++) {
          line += ' ';
        }
      }
      console.log(line);
    }
  }

  this.export = function () {
    let gameStateExport = [];
    for (let i = 0; i < 4; i++) {
      for (let n = 0; n < 4; n++) {
        gameStateExport.push(this.gameState[i][n]);
      }
    }
    return gameStateExport;
  }

  return this;
}

module.exports = GameState;
