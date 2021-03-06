/*
从仓库出发，收集最大值，按照需求种类平均收集
走到工作台，给予原料
如果工作台输出产品，判断是否需要收集，收集到最大值
收集到的每种原料，平均分配到接下来的 n 个需要的工作台
 */

// eslint-disable-next-line
import regeneratorRuntime from '../js/libs/regenerator-runtime';
import ResourceEmitter from './ResourceEmitter';
import SourceImg from '../resource/SourceImg';
import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';
import { LevelMap } from './puedoLevelMap';

const CARRY_NUM_STYLE = {
  font: 'Arail',
  fontSize: 28,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
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
      capacity: Big(LevelMap.warehouse['level1'].capacity),
      loadingSpeed: Big(LevelMap.warehouse['level1'].loadingSpeed),
      walkSpeed: Big(LevelMap.warehouse['level1'].walkSpeed),
      prevSpeed: null
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
      SourceImg.get('ore'),
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

  _getTotalCarry() {
    let { carry } = this._data;
    return Object.keys(carry)
      .map(key => carry[key].amount)
      .reduce((total, amount) => {
        return total.plus(amount);
      }, Big(0));
  }

  getIsOnRoutine() {
    return this._data.onRoutine;
  }

  setIsOnRoutine(onRoutine) {
    this._data.onRoutine = onRoutine;
  }

  getCapacity() {
    return this._data.capacity;
  }

  getHasFreeCapacity() {
    let { capacity } = this._data;
    let totalCarry = this._getTotalCarry();
    return capacity.gt(totalCarry);
  }

  getFreeCapacity() {
    let { capacity } = this._data;
    let totalCarry = this._getTotalCarry();
    return capacity.minus(totalCarry);
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
    // console.log(carry);
    return new Promise(resolve => {
      this.setIsOnRoutine(true);
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

  updateCarryNum() {
    let { carry } = this._data;
    let totalRest = Object.keys(carry).reduce((total, key) => {
      return total.plus(carry[key].amount);
    }, Big(0));
    this.setCarryNum(formatBigNum(totalRest));
  }

  moveToStation(station) {
    return this.move(station.y + 50);
  }

  getCarryKeys() {
    return Object.keys(this._data.carry);
  }

  giveToStation(keys) {
    let emtKeys = keys.map(k => SourceImg.get(k));
    // console.log(emtKeys);
    this.emt.changeTexture(emtKeys);
    this.emt.start();

    let totalGive = Big(0);
    let giveMap = {};
    keys.forEach(key => {
      let { carry } = this._data;
      if (carry[key].stationAmount > 0) {
        let decAmount = carry[key].amount.div(carry[key].stationAmount);

        carry[key].amount = carry[key].amount.minus(decAmount);
        carry[key].amountHu = carry[key].amount.toString();
        carry[key].stationAmount -= 1;

        totalGive = totalGive.plus(decAmount);
        giveMap[key] = {
          amount: decAmount,
          amountHu: decAmount.toString()
        };
      }
    });

    let { loadingSpeed } = this._data;
    let stayDuration = parseInt(totalGive.div(loadingSpeed).times(1000), 10);

    return {
      giveMap,
      stayDuration
    };
  }

  giveToStationLoading(stayDuration) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.stopGiveToStation();
        this.updateCarryNum();
        resolve();
      }, stayDuration);
    });
  }

  stopGiveToStation() {
    this.emt.stop();
  }

  takeFromStation(workerCarry) {
    let { carry } = this._data;
    if (carry[workerCarry.key]) {
      carry[workerCarry.key].amount = carry[workerCarry.key].amount.plus(
        workerCarry.amount
      );
      carry[workerCarry.key].amountHu = carry[
        workerCarry.key
      ].amount.toString();
      // should update stationAmount ??
    } else {
      carry[workerCarry.key] = {
        amount: workerCarry.amount,
        amountHu: workerCarry.amountHu,
        stationAmount: workerCarry.stationAmount
      };
    }

    let stayDuration = parseInt(
      workerCarry.amount.div(this._data.loadingSpeed).times(1000),
      10
    );

    return {
      stayDuration
    };
  }

  async backToWarehouse() {
    this.setCarryNum(0);
    this.back();
    await this.move(this.startY);
    this.stand();
    this.setIsOnRoutine(false);
  }

  multipleSpeed(times) {
    this._data.prevSpeed = {
      loadingSpeed: Big(this._data.loadingSpeed), // copy object
      walkSpeed: this._data.walkSpeed
    };
    this._data.loadingSpeed = this._data.loadingSpeed.times(times);
    this._data.walkSpeed = this._data.walkSpeed * times;
  }

  resetSpeed() {
    if (!this._data.prevSpeed) {
      return;
    }
    this._data.loadingSpeed = this._data.prevSpeed.loadingSpeed;
    this._data.walkSpeed = this._data.prevSpeed.walkSpeed;
  }

  setLevelProps({ capacity, loadingSpeed, walkSpeed }) {
    this._data.capacity = capacity;
    this._data.loadingSpeed = loadingSpeed;
    this._data.walkSpeed = walkSpeed;
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
