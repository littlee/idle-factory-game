window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

class WorkerMarket extends window.Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'worker_market');

    this.gameRef = game;

    this.animations.add('walk', [0, 1], 5, true);
    this.animations.add('walk_box', [2, 3], 5, true);
    this.animations.add('back_box', [4, 5], 5, true);
    this.animations.add('back', [6, 7], 5, true);
  }

  stand() {
    this.animations.stop(null, true);
  }

  walk() {
    this.animations.play('walk');
  }

  walkWithBox() {
    this.animations.play('walk_box');
  }

  back() {
    this.animations.play('back');
  }

  backWithBox() {
    this.animations.play('back_box');
  }
}

export default WorkerMarket;
