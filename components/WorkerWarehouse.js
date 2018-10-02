/* 
从仓库出发，收集最大值，按照需求种类平均收集
走到工作台，给予原料
如果工作台输出产品，判断是否需要收集，收集到最大值
收集到的每种原料，平均分配到接下来的 n 个需要的工作台
 */

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

const SPEED = {
  normal: 0.3,
  fast: 0.5
};

class WorkerWarehouse extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this._data = {
      carry: [],
      maxCarry: Big(1000),
      onRoutine: false,
      speed: SPEED.normal
    };

    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.man = this.game.make.sprite(0, 0, 'worker_warehouse');
    this.man.animations.add('walk', [0, 1], 5, true);
    this.man.animations.add('walk_box', [2, 3], 5, true);
    this.man.animations.add('back_box', [4, 5], 5, true);
    this.man.animations.add('back', [6, 7], 5, true);

    this.emt = new ResourceEmitter(
      this.game,
      this.man.width / 2,
      this.man.height / 2,
      SOURCE_IMG_MAP['ore'],
      200,
      -100,
      500,
      250
    );

    this.carryNum = this.game.make.text(0, 0, '0', CARRY_NUM_STYLE);
    this.carryNum.alignIn(this.man, window.Phaser.CENTER, 0, 20);
    this.carryNum.visible = false;

    this.add(this.man);
    this.add(this.emt);
    this.add(this.carryNum);
  }

  getIsOnRoutine() {
    return this._data.onRoutine;
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

  carryFromWarehouse(neededKeys) {
    this._data.onRoutine = true;
    this._data.carry = neededKeys.map(key => {
      return {
        key,
        amount: Big(100)
      };
    });
    this.setCarryNum(formatBigNum(this._data.maxCarry));
    this.walkWithBox();
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  setCarryNum(num) {
    this.carryNum.setText(num);
    this.carryNum.alignIn(this.man, window.Phaser.CENTER, 0, 20);
  }

  moveToStation(station) {
    return this.move(station.y + 50);
  }

  stayInStation() {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  getCarryKeys() {
    return this._data.carry.map(c => c.key);
  }

  giveToStation(keys) {
    keys = keys.map(k => SOURCE_IMG_MAP[k]);
    this.emt.changeTexture(keys);
    this.emt.start();
  }

  stopGiveToStation() {
    this.emt.stop();
  }

  takeProdFromStation(station) {}

  async backToWarehouse() {
    this.back();
    await this.move(this.startY);
    this.stand();
    this._data.onRoutine = false;
  }

  stand() {
    this.man.animations.stop(null, true);
    this.man.frame = 0;
  }

  walk() {
    this.man.animations.play('walk');
  }

  walkWithBox() {
    this.carryNum.visible = true;
    this.man.animations.play('walk_box');
  }

  back() {
    this.carryNum.visible = false;
    this.man.animations.play('back');
  }

  backWithBox() {
    this.man.animations.play('back_box');
  }
}

export default WorkerWarehouse;
