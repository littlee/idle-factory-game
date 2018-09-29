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
  canvas: canvas
});

// realtime-update-related data
game.share = {
  coin: 0,
  cash: 0,
  market: {
    level: 1,
    multiplier: 1,
    maxTransported: 0,
    transportCount: 1,
    transCapacity: 1,
    loadingSpeed: 1,
    walkSpeed: 1
  },
  warehouse: {
    level: 1,
    multiplier: 1,
    maxTransported: 0,
    transportCount: 1,
    transCapacity: 1,
    loadingSpeed: 1,
    walkSpeed: 1
  }
};

window.game = game;

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);
game.state.start('Start');
