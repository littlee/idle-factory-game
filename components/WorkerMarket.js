// eslint-disable-next-line
import regeneratorRuntime from '../js/libs/regenerator-runtime';
import ResourceEmitter from './ResourceEmitter';
import SOURCE_IMG_MAP from '../constants/SourceImgMap';
import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

const CARRY_NUM_STYLE = {
  font: 'Arail',
  fontSize: 28,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};


class WorkerMarket extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);

    this._data = {
      carry: Big(0),
      onRoutine: false,
      capacity: Big(2000),
      loadingSpeed: Big(1000),
      walkSpeed: 0.2
    };

    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.man = this.game.make.sprite(0,0,'worker_market');

    this.man.animations.add('walk', [0, 1], 5, true);
    this.man.animations.add('walk_box', [2, 3], 5, true);
    this.man.animations.add('back_box', [4, 5], 5, true);
    this.man.animations.add('back', [6, 7], 5, true);

    this.carryNum = this.game.make.text(0, 0, '0', CARRY_NUM_STYLE);
    this.carryNum.alignIn(this.man, window.Phaser.CENTER, 0, 20);
    this.carryNum.visible = false;

    this.add(this.man);
    this.add(this.carryNum);
  }

  getIsOnRoutine() {
    return this._data.onRoutine;
  }

  setIsOnRoutine(onRoutine) {
    this._data.onRoutine = onRoutine;
  }

  move(y) {
    return new Promise(resolve => {
      let { walkSpeed } = this._data;
      let prevY = this.y;
      let duration = Math.abs(y - prevY) / walkSpeed;
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

  goOutFromMarket() {
    this.setIsOnRoutine(true);
    this.walkWithBox();
  }

  moveToStation(station) {
    return this.move(station.y + 50);
  }

  takeFromStation() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async backToMarket() {
    this.backWithBox();
    await this.move(this.startY);
  }

  sellProd() {
    return new Promise(resolve => {
      this.walkWithBox();
      setTimeout(() => {
        this.setIsOnRoutine(false);
        resolve();
      }, 1000);
    });
  }

  stand() {
    this.man.animations.stop(null, true);
    this.man.frame = 0;
  }

  walk() {
    this.man.animations.play('walk');
  }

  walkWithBox() {
    this.man.animations.play('walk_box');
  }

  back() {
    this.man.animations.play('back');
  }

  backWithBox() {
    this.man.animations.play('back_box');
  }
}

export default WorkerMarket;
