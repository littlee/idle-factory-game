const INIT_FPS = 5;

class Worker extends window.Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'worker');
    this.animations.add('work', null, INIT_FPS, true);
    this.frame = 2;
  }

  stop() {
    this.animations.stop(null, true);
    this.frame = 2;
  }

  work() {
    this.stop();
    this.animations.play('work', INIT_FPS);
  }

  multipleSpeed(times) {
    this.stop();
    this.animations.play('work', INIT_FPS * times);
  }

  resetSpeed() {
    this.work();
  }
}

export default Worker;
