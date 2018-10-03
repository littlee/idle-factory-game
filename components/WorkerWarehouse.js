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

/*
- Max Resource Transported ??? 计算出来的数字 x/min
- Transporters
- Transporter Capacity
- Transporter Loading Speed
- Transporter Walk Speed
 */

class WorkerWarehouse extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this._data = {
      carry: {},
      onRoutine: false,
      speed: SPEED.normal,
      capacity: Big(2000),
      loadingSpeed: Big(1000),
      walkSpeed: 0.2
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

  getCapacity() {
    return this._data.capacity;
  }

  goFast() {
    this._data.speed = SPEED.fast;
  }

  goNormal() {
    this._data.speed = SPEED.normal;
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

  carryFromWarehouse(carry) {
    return new Promise(resolve => {
      this._data.onRoutine = true;
      this.walkWithBox();
      let { capacity, loadingSpeed } = this._data;
      let carryDuration = parseInt(capacity.div(loadingSpeed).times(1000), 10);
      this.setCarry(carry);
      setTimeout(() => {
        this.setCarryNum(formatBigNum(capacity));
        resolve();
      }, carryDuration);
    });
  }

  setCarry(carry) {
    this._data.carry = carry;
  }

  setCarryNum(num) {
    this.carryNum.setText(`${num}`);
    this.carryNum.alignIn(this.man, window.Phaser.CENTER, 0, 20);
  }

  moveToStation(station) {
    return this.move(station.y + 50);
  }

  getCarryKeys() {
    return Object.keys(this._data.carry);
  }

  giveToStation(keys) {
    let emtKeys = keys.map(k => SOURCE_IMG_MAP[k]);
    this.emt.changeTexture(emtKeys);
    this.emt.start();

    let totalGive = Big(0);
    let giveMap = {};
    keys.forEach(key => {
      let { carry } = this._data;
      let decAmount = carry[key].amount.div(carry[key].stationAmount);

      carry[key].amount = carry[key].amount.minus(decAmount);
      carry[key].amountHu = carry[key].amount.toString();
      carry[key].stationAmount -= 1;

      totalGive = totalGive.plus(decAmount);
      giveMap[key] = {
        amount: decAmount,
        amountHu: decAmount.toString()
      };
    });
    let { carry, loadingSpeed } = this._data;
    let stayDuration = parseInt(totalGive.div(loadingSpeed).times(1000), 10);

    let totalRest = Object.keys(carry).reduce((total, key) => {
      return total.plus(carry[key].amount);
    }, Big(0));

    return new Promise(resolve => {
      setTimeout(() => {
        this.stopGiveToStation();
        this.setCarryNum(formatBigNum(totalRest));
        resolve(giveMap);
      }, stayDuration);
    });
  }

  stopGiveToStation() {
    this.emt.stop();
  }

  takeProdFromStation(station) {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  async backToWarehouse() {
    this.setCarryNum(0);
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
