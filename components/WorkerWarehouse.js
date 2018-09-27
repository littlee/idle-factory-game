class WorkerWarehouse extends window.Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'worker_warehouse');

    this.gameRef = game;

    this.animations.add('walk', [0, 1], 5, true);
    this.animations.add('walk_box', [2, 3], 5, true);
    this.animations.add('back_box', [4, 5], 5, true);
    this.animations.add('back', [6, 7], 5, true);
  }

  move(y, speed = 0.5, cb = () => {}) {
    return new Promise(resolve => {
      let prevY = this.y;
      let duration = (y - prevY) / speed;
      this.game.add
        .tween(this)
        .to(
          {
            y
          },
          duration,
          null,
          true
        )
        .onComplete.add(() => {
          cb && cb();
          resolve();
        });
    });
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

export default WorkerWarehouse;
