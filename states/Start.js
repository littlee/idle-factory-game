window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

import config from '../config';
// import Big from '../js/libs/big.min.js';
// import { formatBigNum } from '../utils';

class Start extends window.Phaser.State {
  init() {
    this.stage.backgroundColor = '#fff';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  preload() {
    this.load.baseURL = config.BASE_URL;


    this.load.image('test_ground', 'test/Ground00_88400421.png');
    this.load.image('test_wall', 'test/WallWide_88400188.png');
    this.load.image('test_iconEgg', 'test/Egg_Base.png');
    this.load.image('test_panel', 'test/act_rule_frame.png');
    this.load.image('test_txt', 'test/act_rule_text.png');
  }

  create() {

    // this.state.start('Game');
    this.state.start('Test');

    // console.log(formatBigNum(Big('123456789123456789')))
  }
}

export default Start;
