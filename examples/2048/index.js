const gameState = new require('./game')();

for (var i = 0; i < 20; i++) {
  gameState.generate();
  console.log('before');
  gameState.display();
  // AI make pick
  gameState.move('up');
  console.log('after');
  gameState.display();
  if (gameState.checkComplete()) {
    break;
  }
}
