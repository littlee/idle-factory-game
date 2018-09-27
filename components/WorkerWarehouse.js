// eslint-disable-next-line
import regeneratorRuntime from '../js/libs/regenerator-runtime';

const SPEED = {
  normal: 0.3,
  fast: 0.5
};

class WorkerWarehouse extends window.Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'worker_warehouse');
    this.startX = x;
    this.startY = y;

    this._data = {
      carry: [],
      speed: SPEED.normal
    };

    this.animations.add('walk', [0, 1], 5, true);
    this.animations.add('walk_box', [2, 3], 5, true);
    this.animations.add('back_box', [4, 5], 5, true);
    this.animations.add('back', [6, 7], 5, true);
  }

  getSpeed() {
    return this._data.speed;
  }

  goFast() {
    this._data.speed = SPEED.fast;
  }

  goNormal() {
    this._data.speed = SPEED.normal;
  }

  move(y) {
    return new Promise(resolve => {
      let prevY = this.y;
      let duration = Math.abs(y - prevY) / this.getSpeed();
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
          resolve();
        });
    });
  }

  carryFromWarehouse(warehouse) {
    this.walkWithBox();
    return new Promise(resolve => {});
  }

  moveToStation(station) {
    return this.move(station.y + 50);
  }

  tradeWithStation(station) {
    return new Promise(resolve => {});
  }

  async backToWarehouse() {
    this.back();
    await this.move(this.startY);
    this.stand();
  }

  stand() {
    this.animations.stop(null, true);
    this.frame = 0;
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
