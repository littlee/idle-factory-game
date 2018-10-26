import './js/libs/weapp-adapter';
import './js/libs/symbol';
import './js/libs/stub';
import './js/phaserGlobals';

import StartState from './states/Start.js';
import GameState from './states/Game.js';
import TestState from './states/Test.js';

var aspect = window.innerWidth / window.innerHeight;
var gameWidth = 750;
var gameHeight = Math.round(gameWidth / aspect);

var game = new Phaser.Game({
  width: gameWidth,
  height: gameHeight,
  renderer: Phaser.CANVAS,
  canvas: canvas,
  enableDebug: false
});

window.game = game;

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);
game.state.start('Start');
