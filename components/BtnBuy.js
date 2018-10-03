/*
处理成组件，显示的金额通过传入显示，调用fn来实现改动。可以实时反映当前coin的数目够不够买东西。
【问题】功能是相似的，但是购买按钮的尺寸大小不一。
*/

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '24px',
    fill: color || 'white',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

const INIT = {
  coinNeeded: 233,
  cashNeeded: 33,
  boughtFlag: false
};

// 如果是作为item的话
class BtnBuy extends window.Phaser.Group {
  constructor({
    game,
    alignToObj = null,
    target2buy = null,
    coinNeeded = INIT.coinNeeded,
    cashNeeded = INIT.cashNeeded,
    boughtFlag = INIT.boughtFlag,
    resourcesTable  = null,
    upperLayer = null

  }) {
    super(game, undefined);
    this.alignToObj = alignToObj;
    this.resourcesTable = resourcesTable;
    this.can = false;
    this.target2buy = target2buy;
    this.upperLayer = upperLayer;

    this.keyCoinAble = 'btn_cash_able2buy';
    this.keyCoinUnable = 'btn_cash_unable2buy';
    this.keyDollar = null;
    this.keyBought = 'icon_tick';

    this._data = {
      coinNeeded: coinNeeded,
      cashNeeded: cashNeeded,
      boughtFlag: boughtFlag
    };

    this._getInit();
    this.greyOutBtnOrNot();
  }

  _drawUI = () => {
    this.btn = this.game.make.image(0, 0, this.keyCoinAble);
    this.btn.alignTo(this.alignToObj, Phaser.BOTTOM_RIGHT, -7, -77);
    this.coinNeededTxt = this.game.make.text(
      0,
      0,
      this._data.coinNeeded,
      getFontStyle()
    );
    this.coinNeededTxt.alignTo(this.btn, Phaser.BOTTOM_LEFT, -36, -67);
    this.btn.visible = !this._data.boughtFlag;
    this.coinNeededTxt.visible = !this._data.boughtFlag;

    this.iconTick = this.game.make.image(0, 0, this.keyBought);
    this.iconTick.alignTo(this.alignToObj, Phaser.BOTTOM_RIGHT, -15, -68);
    this.iconTick.visible = this._data.boughtFlag;
  };

  _getInit = () => {
    this._drawUI();

    this.btn.events.onInputDown.add(this._handleClick);
    this.coinNeededTxt.events.onInputDown.add(this._handleClick);

    this.addChild(this.btn);
    this.addChild(this.coinNeededTxt);
    this.addChild(this.iconTick);
  };

  getData = () => {
    return this._data;
  }

  greyOutBtnOrNot = () => {
    let currCoin = 300; // fetch current coin value - keep data as flesh as possible
    if (currCoin < this._data.coinNeeded) {
      this.can = false;
      this.btn.loadTexture(this.keyCoinUnable);
    } else {
      this.can = true;
      this.btn.loadTexture(this.keyCoinAble);
      this.upperLayer.rmBgVeil();
    }
  }

  isBought = () => {
    return this._data.boughtFlag;
  }

  _handleClick = () => {
    // let currCoin = 0; // fetch
    console.log('点击resouce modal购买按钮');
    if (this.can === true) {
      console.log('减coin，update当前btnUI，变成tick，最外面的原料桌子上要有新的resource', this.target2buy);
      this.resourcesTable.addGood(this.target2buy);
      // this.upperLayer.rmBgVeil();
      this._setBoughtFlagTrue();
      return true;
    }
    return false;
  }

  _setBoughtFlagTrue = () => {
    this._data.boughtFlag = true;
    this.btn.visible = !this._data.boughtFlag;
    this.coinNeededTxt.visible = !this._data.boughtFlag;
    this.iconTick.visible = this._data.boughtFlag;
  };
}

export default BtnBuy;
