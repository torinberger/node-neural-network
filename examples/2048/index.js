const gameState = new require('./game')();

let options = ['up', 'right', 'down', 'left'];

for (var i = 0; i < 60; i++) {
  gameState.generate();
  gameState.display();
  gameState.move(options[i % 4]);
  if(gameState.checkComplete()) {
    console.log(gameState.getScore());
    break;
  }
}
