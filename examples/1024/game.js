/* eslint-disable no-constant-condition */

function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function chanceToBool(chance) {
  return Math.random() * (100 - 0) + 0 <= chance;
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
  0: 0,
  0.1: 2,
  0.2: 4,
  0.3: 8,
  0.4: 16,
  0.5: 32,
  0.6: 64,
  0.7: 128,
  0.8: 256,
  0.9: 512,
  1: 1024,
};

const GameState = function GameState() {
  this.gameState = [];
  this.score = 0;
  this.lastMove = '';

  for (let i = 0; i < 4; i) {
    this.gameState[i] = [];
    for (let n = 0; n < 4; n += 1) {
      this.gameState[i][n] = 0;
    }
  }

  this.checkComplete = function checkComplete() {
    for (let i = 0; i < 4; i += 1) {
      for (let n = 0; n < 4; n += 1) {
        if (this.gameState[i][n] === 0) {
          return false;
        } if (i > 0 && this.gameState[i][n] > 0) {
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
  };

  this.checkFull = function checkFull() {
    for (let i = 0; i < 4; i += 1) {
      for (let n = 0; n < 4; n += 1) {
        if (this.gameState[i][n] === 0) {
          return false;
        }
      }
    }

    return true;
  };

  this.generate = function generate() {
    while (true) {
      if (this.checkFull()) {
        return true;
      }
      const x = randomInRange(0, 3);
      const y = randomInRange(0, 3);
      if (this.gameState[x][y] === 0) {
        this.gameState[x][y] = 0.1 + (Number(chanceToBool(25)) * 0.1);
        return false;
      }
    }
  };

  this.move = function move(direction) {
    if (this.lastMove === direction) {
      return false;
    }
    this.lastMove = direction;

    if (direction === 'up') {
      // progresses down then right
      while (true) {
        let changed = false;
        for (let n = 0; n < 4; n += 1) {
          for (let i = 0; i < 4; i += 1) {
            if (i > 0 && this.gameState[i][n] > 0 && this.gameState[i][n] !== 1) {
              if (this.gameState[i - 1][n] === this.gameState[i][n] && typeof this.gameState[i][n] !== 'string') {
                this.gameState[i - 1][n] = Math.round((this.gameState[i - 1][n] + 0.1) * 10) / 10;
                this.score += scoreMatrix[String(this.gameState[i - 1][n])];
                // set to string so they cant combine again
                this.gameState[i - 1][n] = String(this.gameState[i - 1][n]);
                this.gameState[i][n] = 0;
                changed = true;
              } else if (this.gameState[i - 1][n] === 0) {
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
      // progresses left then down
      while (true) {
        let changed = false;
        for (let i = 0; i < 4; i += 1) {
          for (let n = 3; n > -1; n -= 1) {
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
    } else if (direction === 'down') {
      // progresses up then right
      while (true) {
        let changed = false;
        for (let n = 0; n < 4; n += 1) {
          for (let i = 3; i > -1; i -= 1) {
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
      // progresses right then down
      while (true) {
        let changed = false;
        for (let i = 0; i < 4; i += 1) {
          for (let n = 0; n < 4; n += 1) {
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

    for (let i = 0; i < 4; i += 1) {
      for (let n = 0; n < 4; n += 1) {
        this.gameState[i][n] = Number(this.gameState[i][n]);
      }
    }

    return true;
  };

  this.getScore = function getScore() {
    return this.score;
  };

  this.display = function display() {
    console.log(' --- Game State ---');
    for (let i = 0; i < 4; i += 1) {
      let line = '';
      for (let n = 0; n < 4; n += 1) {
        line += `${this.gameSate[i][n]}`;
        for (let k = 0; k < (4 - String(this.gameState[i][n]).length); k += 1) {
          line += ' ';
        }
      }
      console.log(line);
    }
  };

  this.exportGame = function exportGame() {
    const gameStateExport = [];
    for (let i = 0; i < 4; i += 1) {
      for (let n = 0; n < 4; n += 1) {
        gameStateExport.push(this.gameState[i][n]);
      }
    }
    return gameStateExport;
  };

  return this;
};

module.exports = GameState;
