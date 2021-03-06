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

// window.wx.setEnableDebug({
//   enableDebug: true
// });

window.game = game;

game.state.add('Start', StartState, false);
game.state.add('Game', GameState, false);
game.state.add('Test', TestState, false);

window.wx.showShareMenu({});
window.wx.onShareAppMessage(() => {
  return {
    title: '工业大亨2',
    imageUrl: '__static/images/share.png'
  };
});

window.wx.onHide(() => {
  console.log('隐藏到后台');
  // 存下该存的东西
  let data = game.state.getCurrentState().saveAllRelevantData();
  window.wx.setStorageSync('idleFactory', JSON.stringify(data));
});

window.wx.onShow((opts) => {
  // 计算时间差值，计算出分钟数，传入GameState的方法。控制弹窗的出现
  console.log('恢复到前台');
  let payload = window.wx.getStorageSync('idleFactory');
  if (payload) {
    payload = JSON.parse(payload);
  }
  let currState = game.state.getCurrentState();
  // 渲染分两种情况
  if (currState === undefined || !payload) {
    game.state.start('Start', true, false, payload || null);
  } else {
    currState.offlineCoin = payload.offlineCoin; // for one-time-off share click
    currState.showModalIdle(payload.hideTs, payload.offlineCoin, payload.offlineDuration);
  }
});
