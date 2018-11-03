import { LevelMap } from './puedoLevelMap.js';
import range from '../js/libs/_/range';
import Big from '../js/libs/big.min';

// const INIT_LEVEL = 1;

const BTN_TEXT_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff'
};

class BtnUpgrade extends window.Phaser.Group {
  constructor(game, x, y, type, currLevel = 1) {
    super(game);
    this.x = x;
    this.y = y;
    this.type = type;
    if (this.type) {
      this.map = LevelMap[type];
      this.mapLength = Object.keys(this.map).length;
    }


    this._data = {
      level: currLevel
    };

    this.btn = this.game.make.sprite(0, 0, 'btn_level');
    this.arrow1 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow1.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 10);
    this.arrow10 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow10.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 18);
    this.arrow50 = this.game.make.sprite(0, 0, 'icon_level_up');
    this.arrow50.alignIn(this.btn, window.Phaser.TOP_RIGHT, 10, 26);
    this.hideAllArrows();

    this.btnText = this.game.make.text(0, 0, '等级', BTN_TEXT_STYLE);
    this.btnText.alignIn(this.btn, window.Phaser.TOP_CENTER, 0, -15);

    this.levelText = this.game.make.text(0, 0, this._data.level.toString(), BTN_TEXT_STYLE);
    this.levelText.alignIn(this.btn, window.Phaser.BOTTOM_CENTER, 0, -5);

    this.add(this.btn);
    this.add(this.arrow50);
    this.add(this.arrow10);
    this.add(this.arrow1);
    this.add(this.btnText);
    this.add(this.levelText);

    // this._init();
  }

  // _init() {
  //   this.setLevel(INIT_LEVEL);
  // }

   _getCustomizedLevelCoinNeeded = (upCount) => {
    let targetLevel = upCount + this._data.level;
    if (this._data.level >= this.mapLength || targetLevel > this.mapLength) {
      return 0;
    } else if (targetLevel === this.mapLength) {
      return this.map[`level${this.mapLength}`].coinNeeded;
    } else {
      return this.map[`level${targetLevel}`].coinNeeded;
    }
  }

  _getCustomizedLevelCoinNeededAccumulated = (upCount) => {
    // recursive, can't, iterative
    let arr = [];
    let fullRange = range(upCount).every(item => {
      let tmp = this._getCustomizedLevelCoinNeeded(item+1);
      arr.push(Big(tmp));
      if (tmp === 0) return false;
      return true;
    });
    if (fullRange) {
      return arr.reduce((prev, curr) => {
        return prev.plus(curr);
      });
    } else {
      return Big(0);
    }
  }

   _check2ShowSingleArrow = (multiplier, currCoin) => {

    if (this._data.level >= this.mapLength) {
      this.hideArrowByName(multiplier);
      return false;
    }
    let coinNeeded = this._getCustomizedLevelCoinNeededAccumulated(multiplier);
    // console.log('coinNeeded: ', coinNeeded.toString());
    if (coinNeeded.eq(0) || currCoin.lt(coinNeeded)) {
      this.hideArrowByName(multiplier);
      return false;
    } else {
      this.showArrowByName(multiplier);
      return true;
    }
  }

  check2ShowAllArrows = (currCoin) => {
    let one = this._check2ShowSingleArrow(1, currCoin);
    if (one === true) {
      let ten = this._check2ShowSingleArrow(10, currCoin);
      if (ten !== true) return false;
      this._check2ShowSingleArrow(50, currCoin);
    } else {
      this.hideAllArrows();
    }
  }

  onClick(func, context) {
    this.btn.inputEnabled = true;
    this.btn.input.priorityID = 999;
    this.btn.events.onInputUp.add(func, context);
  }

  setLevel(level) {
    this._data.level = level;
    this.levelText.setText(level.toString());
    this.levelText.alignIn(this.btn, window.Phaser.BOTTOM_CENTER, 0, -5);
  }

  getLevel() {
    return this._data.level;
  }

  showArrowByName = (name) => {
    this[`arrow${name}`].visible = true;
  }

  hideArrowByName = (name) => {
    this[`arrow${name}`].visible = false;
  }

  hideAllArrows = () => {
    this.arrow1.visible = false;
    this.arrow10.visible = false;
    this.arrow50.visible = false;
  }
}

export default BtnUpgrade;
