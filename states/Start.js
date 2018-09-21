window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

import config from '../config';

class Start extends window.Phaser.State {
  init() {
    this.stage.backgroundColor = '#fff';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  preload() {
    this.load.baseURL = config.BASE_URL;
    this.load.image('ground', 'images/Ground00_88400421.png');
    this.load.image('wall', 'images/WallWide_88400188.png');
  }

  create() {

    // this.state.start('Game');
    this.state.start('Test');
  }
}

export default Start;
