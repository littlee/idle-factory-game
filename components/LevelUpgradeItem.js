import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

const CONFIG = {
  width: 537,
  height: 85,
  subWidth: 146, // the right block
  subHeight: 85,
  bgColor: 0x000000,
  bgAlpha: 0.1,
  subColor: 0x3a0a00,
  subAlpha: 0.8
};

const INIT = {
  value: 1,
  increment: 0.1
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize,
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'right',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

const ITEM_UNIT_MAP = {
  maxTransported: '/min',
  count: '',
  capacity: '',
  loadingSpeed: '/s',
  walkSpeed: '/s',
  input: '/min',
  output: '/min',
  power: '',
};

class LevelUpgradeItem extends window.Phaser.Group {
  constructor({ game, parent, key, txt, x = 0, y = 0, levelType, itemName, value = null, increment = null, panelUpgradeInstance = null }) {
    super(game, parent);
    this.key = key;
    this.plainTxt = txt;
    this.posX = x;
    this.posY = y;

    this.increment = increment === null ? Big(INIT.increment) : Big(increment);
    this.panelUpgradeInstance = panelUpgradeInstance;

    this._data = {
      value: value === null ? Big(INIT.value) : Big(value),
      levelType: levelType,
      itemName: itemName,
      unit: ITEM_UNIT_MAP[itemName]
    };

    this._getInit();
  }

  _getInit = () => {
    this.x = this.posX;
    this.y = this.posY;

    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(CONFIG.bgColor, CONFIG.bgAlpha);
    this.bg.drawRect(0, 0, CONFIG.width, CONFIG.height);
    this.bg.endFill();

    this.base = this.game.make.image(0, CONFIG.height / 2, 'icon_base');
    this.base.anchor.set(0, 0.5);

    // 区分是icon类的图，还是reso || prod
    this.icon = this.game.make.image(0, CONFIG.height / 2, this.key);
    this.icon.anchor.set(0, 0.5);
    if (this.key.indexOf('icon') === -1) {
      this.icon.anchor.set(-0.15, 0.5);
      this.icon.scale.x = 0.5;
      this.icon.scale.y = 0.5;
    }

    this.txtDes = this.game.make.text(0, 0, this.plainTxt, getFontStyle('30px'));
    this.txtDes.alignTo(this.base, Phaser.RIGHT_BOTTOM, 10, -15);

    this.block = this.game.make.graphics(0, 0);
    this.block.beginFill(CONFIG.subColor, CONFIG.subAlpha);
    this.block.drawRect(0, 0, CONFIG.subWidth, CONFIG.subHeight);
    this.block.endFill();
    this.block.alignTo(this.bg, Phaser.TOP_RIGHT, -10, -85);

    // 要变化的 setTextBounds( [x] [, y] [, width] [, height])
    this.txtCurr = this.game.make.text(
      0,
      0,
      formatBigNum(this._data.value) + this._data.unit,
      getFontStyle('24px', 'white', 'center', 'normal')
    );
    this.txtCurr.setTextBounds(0, 0, this.block.width - 10, 28);
    this.txtCurr.alignTo(this.block, Phaser.TOP_LEFT, -5, -45);

    this.txtFuture = this.game.make.text(
      0,
      0,
      `+${formatBigNum(this.increment)}${this._data.unit}`,
      getFontStyle('24px', '#38ec43', 'center', 'normal')
    );
    this.txtFuture.setTextBounds(0, 0, this.block.width - 10, 28);
    this.txtFuture.alignTo(this.block, Phaser.TOP_LEFT, -5, -80);

    this.addChild(this.bg);
    this.addChild(this.base);
    this.addChild(this.icon);
    this.addChild(this.txtDes);
    this.addChild(this.block);
    this.addChild(this.txtCurr);
    this.addChild(this.txtFuture);
  }

  getData = () => {
    return this._data;
  }

  getValue = () => {
    return this._data.value;
  }

  // maxTransported logic 添加，5个items completed
  updateItemValue = () => {
    // 在更新等级之前改好item的curr值
    this._data.value = this.increment.plus(this._data.value);
    this.txtCurr.setText(
      formatBigNum(this._data.value) + this._data.unit
    );
  }

  getDesUpdated = (diffs = null) => {
    // diffs = {
    //   capacity: 0, // big
    //   count: 0, // big
    //   loadingSpeed: 0, // big
    //   walkSpeed: 0, // big
    //   coinNeeded: 0, // big,
    //   maxTransported: 0, // big NEW!!
    // };
    this.increment = diffs[this._data.itemName];
    this.txtFuture.setText(`+${formatBigNum(this.increment)}${this._data.unit}`);
  };
}

export default LevelUpgradeItem;
