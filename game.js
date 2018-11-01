import './js/libs/weapp-adapter';
import './js/libs/symbol';
import './js/libs/stub';
import './js/phaserGlobals';
import moment from './js/libs/moment.min.js';

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

window.wx.onHide(() => {
  console.log('隐藏到后台');
  window.wx.setStorageSync('hideTs', moment.utc().format('x'));
});
window.wx.onShow(() => {
  // 计算时间差值，计算出分钟数，传入GameState的方法。控制弹窗的出现
  console.log('恢复到前台');
  let value = window.wx.getStorageSync('hideTs');
  if (value === undefined) {
    console.log('首次加载');
  } else {
    let currState = game.state.current;
    if (currState === 'Game') {
      game.state.states[currState].showModalIdle(value);
    }
  }
});
window.wx.exitMiniProgram(() => {
  console.log('小程序退出');
  window.wx.setStorageSync('hideTs', moment.utc().format('x'));
});

window.game = game;

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);
game.state.start('Start');
