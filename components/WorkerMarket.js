// eslint-disable-next-line
import regeneratorRuntime from '../js/libs/regenerator-runtime';
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
      walkSpeed: 0.2,
      prevSpeed: null
    };

    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;

    this.man = this.game.make.sprite(0, 0, 'worker_market');

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

  getHasCarry() {
    return this._data.carry.gt(0);
  }

  getHasFreeCapacity() {
    let { carry, capacity } = this._data;
    return capacity.gt(carry);
  }

  getFreeCapacity() {
    let { carry, capacity } = this._data;
    return capacity.minus(carry);
  }

  setCarryNum(num) {
    this.carryNum.setText(`${num}`);
    this.carryNum.alignIn(this.man, window.Phaser.CENTER, 0, 20);
    if (this.getHasCarry()) {
      this.carryNum.visible = true;
    } else {
      this.carryNum.visible = false;
    }
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

  takeFromStation(amount) {
    this._data.carry = this._data.carry.plus(amount);
    let stayDuration = parseInt(
      amount.div(this._data.loadingSpeed).times(1000),
      10
    );

    return {
      stayDuration
    };
  }

  takeFromStationLoading(stayDuration) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.setCarryNum(formatBigNum(this._data.carry));
        resolve();
      }, stayDuration);
    });
  }

  async backToMarket() {
    this.backWithBox();
    await this.move(this.startY);
  }

  sellProd() {
    return new Promise(resolve => {
      let oldCarry = Big(this._data.carry);
      let stayDuration = parseInt(
        this._data.carry.div(this._data.loadingSpeed).times(1000),
        10
      );
      this._data.carry = Big(0);
      this.walkWithBox();

      setTimeout(() => {
        this.setCarryNum(formatBigNum(this._data.carry));
        this.setIsOnRoutine(false);
        resolve({ amount: oldCarry });
      }, stayDuration);
    });
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
    if (this.getHasCarry()) {
      this.carryNum.visible = true;
    }
    this.man.animations.play('walk');
  }

  walkWithBox() {
    if (this.getHasCarry()) {
      this.carryNum.visible = true;
    }
    this.man.animations.play('walk_box');
  }

  back() {
    if (!this.getHasCarry()) {
      this.carryNum.visible = false;
    }
    this.man.animations.play('back');
  }

  backWithBox() {
    if (!this.getHasCarry()) {
      this.carryNum.visible = false;
    }
    this.man.animations.play('back_box');
  }
}

export default WorkerMarket;
