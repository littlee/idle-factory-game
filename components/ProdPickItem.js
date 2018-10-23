import { OUTPUT_INPUT_MAP, PROD_DES, PROD_INFO } from '../js/config.js';

const CONFIG = {
  veilWidth: 552,
  veilHeight: 70,
  basedBgColor: '0x000000',
  hightLightedColor: '0xb7f8ba',
  veilAlpha: 0.6,
  basedAlpha: 0.1,
  scaleFactor:  55 / 128,
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '18px',
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}

class ProdPickItem extends window.Phaser.Group {
  constructor({game, output, prodOrder}) {
    super(game);
    this.flagBought = PROD_INFO[output].bought;
    this.flagActivated = PROD_INFO[output].activated;

    this.prodOrder = prodOrder;
    this.outputKey = output; // 需要根据product的等级来变化UI
    this.inputKeyList = OUTPUT_INPUT_MAP[output];

    this.price = PROD_INFO[output].price;
    this.coinNeeded = PROD_INFO[output].coinNeeded;
    this.cashNeeded = PROD_INFO[output].cashNeeded;
    this.prodDes = PROD_DES[output];

    this._getInit();

  }

  _getInit = () => {
    this._drawHightlightedVeil();
    this._drawBaseBg();
    this._drawOutput();
    this._drawInput();
    this._drawPricePanel();
    this._draw2Ticks();
    this._drawVeil();
    this._drawBtnCash();
    this._drawBtnCoin();
    this._drawBtnLocked();
    this._add2ThisGroup();
    this._showInitUI();
  }

  _drawBaseBg = () => {
    this.baseBg = this.game.make.graphics(0, 0);
    this.baseBg.beginFill(0x000000, 0.1);
    this.baseBg.drawRect(0, 0, CONFIG.veilWidth, CONFIG.veilHeight);
    this.baseBg.endFill();
  }

  _drawOutput = () => {
    this.output = this.game.make.image(0, 0, `prod_${this.outputKey}`);
    this.output.scale.x = CONFIG.scaleFactor;
    this.output.scale.y = CONFIG.scaleFactor;

    this.output.alignTo(this.baseBg, Phaser.TOP_LEFT, -30, -62);
  }

  _drawInput = () => {
    this.inputGroup = this.game.make.group();

    if (this.prodOrder === 4) {
      this.input1 = this.game.make.image(0, 0, `prod_${this.inputKeyList[0]}`);
      this.input2 = this.game.make.image(0, 0, `prod_${this.inputKeyList[1]}`);
      this.input1.scale.x = CONFIG.scaleFactor;
      this.input1.scale.y = CONFIG.scaleFactor;
      this.input2.scale.x = CONFIG.scaleFactor;
      this.input2.scale.y = CONFIG.scaleFactor;

      this.input1.alignTo(this.output, Phaser.LEFT_BOTTOM, -225);
      this.input2.alignTo(this.input1, Phaser.LEFT_BOTTOM, 10);


      this.inputGroup.addChild(this.input1);
      this.inputGroup.addChild(this.input2);
    } else if (this.prodOrder === 3) {
      this.input1 = this.game.make.image(0, 0, `prod_${this.inputKeyList[0]}`);
      this.input1.scale.x = CONFIG.scaleFactor;
      this.input1.scale.y = CONFIG.scaleFactor;
      this.input1.alignTo(this.output, Phaser.LEFT_BOTTOM, -200);


      this.inputGroup.addChild(this.input1);

    } else {
      this.input1 = this.game.make.image(0, 0, `reso_${this.inputKeyList[0]}`);
      this.input1.scale.x = CONFIG.scaleFactor;
      this.input1.scale.y = CONFIG.scaleFactor;

      this.input1.alignTo(this.output, Phaser.LEFT_BOTTOM, -200);

      this.inputGroup.addChild(this.input1);
    }
  }
  _drawPricePanel = () => {
    // price

    this.priceGroup = this.game.make.group();
    this.panelPrice = this.game.make.image(0, 0, 'panel_prod_price');
    this.panelPrice.alignTo(this.output, Phaser.LEFT_BOTTOM, -372, 7);

    this.prodDesTxt = this.game.make.text(0, 0, this.prodDes, getFontStyle(undefined, '#f4f78e'));
    this.priceTxt = this.game.make.text(0, 0, this.price, getFontStyle(undefined, '#f4f78e'));
    this.prodDesTxt.alignTo(this.panelPrice, Phaser.TOP_CENTER, 0, -33);
    this.priceTxt.alignTo(this.panelPrice, Phaser.RIGHT_BOTTOM, -50, -5);

    this.priceGroup.addChild(this.panelPrice);
    this.priceGroup.addChild(this.prodDesTxt);
    this.priceGroup.addChild(this.priceTxt);

  }

  _draw2Ticks = () => {
    this.panelTick = this.game.make.image(0, 0, 'btn_tick');
    this.panelTick.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.panelTick.visible = false;

    this.panelTickActivated = this.game.make.image(0, 0, 'btn_tick_activated');
    this.panelTickActivated.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.panelTickActivated.visible = false;
  }

  _drawBtnCash = () => {
    this.btnCashGroup = this.game.make.group();
    this.btnCash = this.game.make.image(0, 0, 'btn_prod_cash');
    this.btnCash.alignTo(this.output, Phaser.LEFT_BOTTOM, -375, 7);

    this.cashTxt = this.game.make.text(0, 0, this.cashNeeded, getFontStyle(undefined, '#f4f78e'));
    this.cashTxt.alignTo(this.btnCash, Phaser.TOP_LEFT, -50, -32);
    this.btnCashGroup.addChild(this.btnCash);
    this.btnCashGroup.addChild(this.cashTxt);
  }

  _drawBtnCoin = () => {
    this.btnCoinGroup = this.game.make.group();
    // change texture
    this.btnCoin = this.game.make.image(0, 0, 'btn_prod_coin');
    this.btnCoin.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.coinTxt = this.game.make.text(0, 0, this.coinNeeded, getFontStyle(undefined, 'white'));
    this.coinTxt.alignTo(this.btnCoin, Phaser.TOP_LEFT, -32, -32);

    this.btnCoinGroup.addChild(this.btnCoin);
    this.btnCoinGroup.addChild(this.coinTxt);
  }

  _drawBtnLocked = () => {
    this.btnLocked = this.game.make.image(0, 0, 'btn_prodLocked');
    this.btnLocked.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.btnLocked.visible = false;
  }

  _drawVeil = () => {
    this.veil = this.game.make.graphics(0, 0);
    this.veil.beginFill(0x000000, 0.6);
    this.veil.drawRect(0, 0, CONFIG.veilWidth, CONFIG.veilHeight);
    this.veil.endFill();
    this.veil.visible = false;
  }

  _drawHightlightedVeil = () => {
    this.hightlightedVeil = this.game.make.graphics(0, 0);
    this.hightlightedVeil.beginFill(CONFIG.hightLightedColor, 0.9);
    this.hightlightedVeil.drawRect(0, 0, CONFIG.veilWidth, CONFIG.veilHeight);
    this.hightlightedVeil.endFill();
    this.hightlightedVeil.visible = false;
  }

  _add2ThisGroup = () => {
    this.addChild(this.hightlightedVeil);
    this.addChild(this.baseBg);

    this.addChild(this.output);
    this.addChild(this.inputGroup);

    this.addChild(this.panelTick);
    this.addChild(this.panelTickActivated);
    this.addChild(this.priceGroup);

    this.addChild(this.veil);

    this.addChild(this.btnCashGroup);
    this.addChild(this.btnCoinGroup);
    this.addChild(this.btnLocked);
  }

  _showInitUI = () => {
    if (this.flagActivated === true) {
      this.setItem2Activated();
    } else if (this.flagBought === true) {
      this.setItem2BoughtNotActivatedUI();
    } else {
      // 紧跟着最后一个bought===true的item后面，coinBtn是要shown的，这里不做处理，让外面的frame处理
      this.setItem2LockedUI();
    }
  }


  _updateOutputUI = () => {
    // loadTexture()
    // this.output.loadTexture('')

  }

  _updateInputUI = () => {
     // this.input.forEach() loadTexture('')
  }

  _showActivatedTick = () => {
    this.panelTickActivated.visible = true;
    this.panelTick.visible = false;
  }

  _showTheRightBtnCoinUI = (currCoin) => {
    if (currCoin.lt(this.price)) {
      this.btnCash.loadTexture('btn_prod_coin_disable', true);
    }
  }

  _setFlagBought2True = () => {
    this.flagBought = true;
  }

  _setFlagActivated2True = () => {
    this.flagActivated = true;
  }

  setItem2LockedUI = () => {
    this.priceGroup.visible = true;
    this.btnCashGroup.visible = false;
    this.veil.visible = true;
    this.panelTick.visible = false;
    this.panelTickActivated.visible = false;
    this.btnCoinGroup.visible = false;
    this.btnLocked.visible = true;
  }


  setItem2BoughtNotActivatedUI = () => {
    this.veil.visible = false;
    this.hightlightedVeil.visible = false;
    this.btnCashGroup.visible = false;
    this.btnCoinGroup.visible = false;
    this.panelTick.visible = true;
    this.btnLocked.visible = false;
  }

  setItem2BuyableUI = () => {
    this.veil.visible = true;
    this.hightlightedVeil.visible = false;

    this.priceGroup.visible = false;
    this.btnCashGroup.visible = true;

    this.panelTick.visible = false;
    this.panelTickActivated.visible = false;
    this.btnCoinGroup.visible = true;
  }

  setItem2Activated = () => {
    this.veil.visible = false;
    this.hightlightedVeil.visible = true;

    this.priceGroup.visible = true;
    this.btnCashGroup.visible = false;

    this.btnLocked.visible = false;
    this.btnCoinGroup.visible = false;
    this._showActivatedTick();
  }




  getUpgradedItemUI = () => {

  }

  getItemCashBtnUpdated = () => {
    // if item's this.flagBought is false, do this. otherwise avoid
    if (this.flagBought !== true) {
      this._showTheRightBtnCoinUI();
    }
  }
}

export default ProdPickItem;
