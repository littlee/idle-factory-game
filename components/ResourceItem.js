import BtnBuy from './BtnBuy.js';

const CONFIG = {
  width: 456,
  height: 85,
  bgColor: 0x000000,
  bgAlpha: 0.1,
  bgUnableAlpha: 0.4
};

const KEY_TARGET_MAP = {
  'reso_ore': 'ore',
  'reso_copper': 'coppoer',
  'reso_barrel': 'barrel',
  'reso_plug': 'plug',
  'reso_aluminium': 'aluminium'
};

class ResourceItem extends window.Phaser.Group {

  constructor({game, parent, key, pWidth, y, coinNeeded, cashNeeded, bought = false}) {
    super(game, parent);
    this.key = key;
    this.posX = (pWidth - CONFIG.width) / 2;
    this.posY = y;

    this._data = {
      target2buy: KEY_TARGET_MAP[key],
      boughtFlag: bought || false,
      coinNeeded,
      cashNeeded,
    };

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

    // btn_*buy
    this.btnBuyGroup = new BtnBuy({
      game: this.game,
      alignToObj: this.bg,
      target2buy: this.key, // should map to a unified name
      coinNeeded: this._data.coinNeeded,
      cashNeeded: this._data.cashNeeded,
      boughtFlag: this._data.boughtFlag
    });

    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.btnBuyGroup);
  }

  getData = () => {
    let data = null;
    data = Object.assign({}, this._data, this.btnBuyGroup.getData());
    return data;
  }

  isBought = () => {
    return this.btnBuyGroup.isBought();
  }

  getTarget = () => {
    return this._data.target2buy;
  }

}


export default ResourceItem;
