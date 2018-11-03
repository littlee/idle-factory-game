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

// window.wx.setEnableDebug({
//   enableDebug: true
// });

window.game = game;

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);

window.wx.onHide(() => {
  console.log('隐藏到后台');
  // 存下该存的东西
  // window.wx.setStorageSync('hideTs', moment.utc().format('x'));
  let data = game.state.states[game.state.current].saveAllRelevantData();
  window.wx.setStorageSync('idleFactory', data);
});

window.wx.onShow(() => {
  // 计算时间差值，计算出分钟数，传入GameState的方法。控制弹窗的出现
  console.log('恢复到前台');
  // 拿存下的信息
  let payload = window.wx.getStorageSync('idleFactory');
  let currState = game.state.states[game.state.current];
  // console.log('idleFactory:',  payload);
  // 渲染分两种情况
  if (currState === undefined || !payload) {
    game.state.start('Start', true, false, payload);
  } else {
    currState.showModalIdle(payload.hideTs);
  }
});

