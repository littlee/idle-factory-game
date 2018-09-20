window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

class Game extends window.Phaser.State {
  create() {
    this.ground = this.add.tileSprite(
      0,
      0,
      this.world.width,
      this.world.height,
      'ground'
    );
    this.wall = this.add.sprite(this.world.centerX, 0, 'wall');
    this.wall.anchor.setTo(0.5, 0);
  }

  update() {
    // this.bg.tilePosition.y += 1;
  }
}

export default Game;
