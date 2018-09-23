window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

class WorkStation extends window.Phaser.Group {
  constructor(game, x, y, tableLevel, index) {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;
  }
}

export default WorkStation;