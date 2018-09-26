const CONFIG = {
  width: 456,
  height: 85,
  bgColor: 0x000000,
  bgAlpha: 0.1,
  bgUnableAlpha: 0.4
};

function getFontStyle (fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '24px',
    fill: color || 'white',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

class ResourceItem extends window.Phaser.Group {

  constructor({game, parent, key, pWidth, y, valueCoin, valueDollar, coinAble, coinUnable, bought}) {
    super(game, parent);
    this.key = key;
    this.posX = (pWidth - CONFIG.width) / 2;
    this.posY = y;
    this.valueCoin = valueCoin || '9ac';
    this.valueDollar = valueDollar || '55';

    this.keyCoinAble = 'btn_cash_able2buy';
    this.keyCoinUnable = 'btn_cash_unable2buy';
    this.keyDollar = null;
    this.keyBought = 'icon_tick';

    this.coinNeed = '55ac';
    this.boughtFlag = bought || false;
    this.coinAble = coinAble || true;

    this._getInit();
  }

  _getInit = () => {
    this.x = this.posX;
    this.y = this.posY;
    let bgAlpha = this.boughtFlag ? CONFIG.bgAlpha : CONFIG.bgUnableAlpha;

    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(CONFIG.bgColor, bgAlpha);
    this.bg.drawRect(0, 0, CONFIG.width, CONFIG.height);
    this.bg.endFill();

    this.icon = this.game.make.image(20, 42, this.key);
    this.icon.anchor.setTo(0, 0.5);

    // btn_*buy - able
    this.btnAbleBuyGroup = this.game.add.group(this);
    this.btnCoinAble = this.game.make.image(0, 0, this.keyCoinAble);
    this.btnCoinAble.alignTo(this.bg, Phaser.BOTTOM_RIGHT, -7, -77);
    this.coinNeededTxt = this.game.make.text(0, 0, this.coinNeed, getFontStyle());
    this.coinNeededTxt.alignTo(this.btnCoinAble, Phaser.BOTTOM_LEFT, -36, -67);


    this.btnAbleBuyGroup.addChild(this.btnCoinAble);
    this.btnAbleBuyGroup.addChild(this.coinNeededTxt);
    this.btnAbleBuyGroup.visible = this.boughtFlag ? false : this.coinAble ? true : false;

    // btn_*buy - unable
    this.btnUnableBuyGroup = this.game.add.group(this);
    this.btnCoinUnable = this.game.make.image(0, 0, this.keyCoinUnable);
    this.btnCoinUnable.alignTo(this.bg, Phaser.BOTTOM_RIGHT, -7, -77);
    this.coinNeededTxtCopied = this.game.make.text(0, 0, this.coinNeed, getFontStyle());
    this.coinNeededTxtCopied.alignTo(this.btnCoinAble, Phaser.BOTTOM_LEFT, -36, -67);

    this.btnUnableBuyGroup.addChild(this.btnCoinUnable);
    this.btnUnableBuyGroup.addChild(this.coinNeededTxtCopied);
    this.btnUnableBuyGroup.visible = this.boughtFlag ? false : this.coinAble ? false : true;

    this.iconTick = this.game.make.image(0, 0, this.keyBought);
    this.iconTick.alignTo(this.bg, Phaser.BOTTOM_RIGHT, -15, -68);
    this.iconTick.visible = this.boughtFlag;

    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.btnAbleBuyGroup);
    this.addChild(this.btnUnableBuyGroup);
    this.addChild(this.iconTick);
  }
}


export default ResourceItem;
