import './js/libs/weapp-adapter';
import './js/libs/symbol';
import './js/libs/stub';

import StartState from './states/Start.js';
import GameState from './states/Game.js';
import TestState from './states/Test.js';

window.PIXI = require('./js/libs/pixi.min');
window.p2 = require('./js/libs/p2.min');
window.Phaser = require('./js/libs/phaser-split.min');


var aspect = window.innerWidth / window.innerHeight;
var gameWidth = 750;
var gameHeight = Math.round(gameWidth / aspect);

var game = new Phaser.Game({
  width: gameWidth,
  height: gameHeight,
  renderer: Phaser.CANVAS,
  canvas: 'canvas'
});

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);
game.state.start('Start');
