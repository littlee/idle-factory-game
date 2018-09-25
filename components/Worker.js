class Worker extends window.Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'worker');

    this.gameRef = game;

    this.animations.add('work', null, 5, true);
  }

  stop() {
    this.animations.stop(null, true);
  }

  work() {
    this.animations.play('work');
  }
}

export default Worker;
