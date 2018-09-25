import ModalRaw from './ModalRaw.js';

window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

// let const = {};

class ModalLevel extends ModalRaw {
  constructor(game) {
    // parems
    super(game);
    this.data = 'data';
  }

  _handleUpgrade = () => {
    console.log('可以。。。');
  };
}

export default ModalLevel;
