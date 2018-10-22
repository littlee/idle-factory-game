import { OUTPUT_INPUT_MAP, PROD_DES, PROD_PRICE_VALUE } from '../js/config.js';

const CONFIG = {
  veilWidth: 552,
  veilHeight: 70,
  basedBgColor: '0x000000',
  hightLightedColor: '0x34ea3d',
  veilAlpha: 0.4,
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
    this.flagBought = false;
    this.flagActivated = false;

    this.prodOrder = prodOrder;
    this.outputKey = output; // 需要根据product的等级来变化UI
    this.inputKeyList = OUTPUT_INPUT_MAP[output];

    this.price = PROD_PRICE_VALUE[output].price;
    this.coinNeeded = PROD_PRICE_VALUE[output].coinNeeded;
    this.cashNeeded = PROD_PRICE_VALUE[output].cashNeeded;
    this.prodDes = PROD_DES[output];

    this._getInit();

  }

  _getInit = () => {
    this._drawBaseBg();
    this._drawOutput();
    this._drawInput();
    this._drawPriceAndValue();
    this._drawActivatedState();
    this._add2ThisGroup();
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

  _updateOutputUI = () => {


  }

  _updateInputUI = () => {

  }

  _drawPriceAndValue = () => {
    // price -> btn_cash
    this.col3Group = this.game.make.group();

    this.panelPrice = this.game.make.image(0, 0, 'panel_prod_price');
    this.panelPrice.alignTo(this.output, Phaser.LEFT_BOTTOM, -375, 7);

    this.prodDesTxt = this.game.make.text(0, 0, this.prodDes, getFontStyle(undefined, '#f4f78e'));
    this.priceTxt = this.game.make.text(0, 0, this.price, getFontStyle(undefined, '#f4f78e'));
    this.prodDesTxt.alignTo(this.panelPrice, Phaser.TOP_CENTER, 0, -33);
    this.priceTxt.alignTo(this.panelPrice, Phaser.RIGHT_BOTTOM, -50, -5);

    this.btnCash = this.game.make.image(0, 0, 'btn_prod_cash');
    this.btnCash.alignTo(this.output, Phaser.LEFT_BOTTOM, -375, 7);
    this.btnCash.visible = false;

    this.cashTxt = this.game.make.text(0, 0, this.cashNeeded, getFontStyle(undefined, '#f4f78e'));
    this.cashTxt.alignTo(this.btnCash, Phaser.TOP_LEFT, -50, -32);
    this.cashTxt.visible = false;

    this.col3Group.addChild(this.panelPrice);
    this.col3Group.addChild(this.prodDesTxt);
    this.col3Group.addChild(this.priceTxt);
    this.col3Group.addChild(this.btnCash);
    this.col3Group.addChild(this.cashTxt);
  }

  _drawActivatedState = () => {
    // tick -> btn_coin -> locked
    this.col4Group = this.game.make.group();

    this.panelTick = this.game.make.image(0, 0, 'btn_tick');
    this.panelTick.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.panelTick.visible = false;

    this.btnCoin = this.game.make.image(0, 0, 'btn_prod_coin');
    this.btnCoin.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.coinTxt = this.game.make.text(0, 0, this.coinNeeded, getFontStyle(undefined, 'white'));
    this.coinTxt.alignTo(this.btnCoin, Phaser.TOP_LEFT, -32, -32);

    this.btnLocked = this.game.make.image(0, 0, 'btn_prodLocked');
    this.btnLocked.alignTo(this.baseBg, Phaser.RIGHT_BOTTOM, -95);
    this.btnLocked.visible = false;

    this.col4Group.addChild(this.panelTick);
    this.col4Group.addChild(this.btnCoin);
    this.col4Group.addChild(this.coinTxt);
    this.col4Group.addChild(this.btnLocked);
  }

  _drawVeil = () => {


  }

  _drawHeightlightedVeil = () => {

  }

  _add2ThisGroup = () => {
    this.addChild(this.baseBg);
    this.addChild(this.output);
    this.addChild(this.inputGroup);
    this.addChild(this.col3Group);
    this.addChild(this.col4Group);
  }

  _makeItembuyable = () => {

  }

  _makeItemActivated = () => {

  }

  _makeVeilShown = () => {

  }

  _updateCoinNeededPanel = () => {

  }

  getUpgradedItemUI = () => {

  }

  getItemUpdated = () => {
    // if item's this.flagBought is false, do this. otherwise avoid
  }
}

export default ProdPickItem;
