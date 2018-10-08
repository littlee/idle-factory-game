import ModalRaw from './ModalRaw.js';
import ResourceItem from './ResourceItem';

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '34px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle'
};

const CONFIG = {
  width: 500,
  height: 717,
  priceTags: {
    'ore': '0',
    'copper': '2000',
    'oilBarrel': '3000000',
    'plug': '4000000000',
    'aluminium': '5000000000000',
    'rubber': '6000000000000000'
  },
};

class ModalRescources extends ModalRaw {
  constructor({
    game,
    height = CONFIG.height,
    width = CONFIG.width,
    headingTxt,
    headingStyles = FONT_STYLE,
    resourcesTable = null,
    scrollable
  }) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;

    this.resourcesTable = resourcesTable;
    this._getInit();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();

    this._prepAfterContentGroup();
  };

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    this.re1 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_ore',
      pWidth: this.w,
      y: OFFSET,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.ore,
      cashNeeded: null
    });

    this.re2 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_copper',
      pWidth: this.w,
      y: OFFSET + 85 + 17,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.copper,
      cashNeeded: null
    });

    this.re3 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_barrel',
      pWidth: this.w,
      y: OFFSET + 85 * 2 + 17 * 2,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.oilBarrel,
      cashNeeded: null
    });

    this.re4 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_plug',
      pWidth: this.w,
      y: OFFSET + 85 * 3 + 17 * 3,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.plug,
      cashNeeded: null
    });

    this.re5 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_aluminium',
      pWidth: this.w,
      y: OFFSET + 85 * 4 + 17 * 4,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.aluminium,
      cashNeeded: null
    });

    this.re6 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_rubber',
      pWidth: this.w,
      y: OFFSET + 85 * 5 + 17 * 5,
      resourcesTable: this.resourcesTable,
      coinNeeded: CONFIG.priceTags.rubber,
      cashNeeded: null
    });
  }

  // 不用
  getInfo2Stored = () => {
    let info = {};
    info.re1 = this.re1.getData();
    info.re2 = this.re2.getData();
    info.re3 = this.re3.getData();
    info.re4 = this.re4.getData();
    info.re5 = this.re5.getData();
    info.re6 = this.re6.getData();
    return info;
  };

  // 更新BtnBuy
  updateBtnBuyUI = (currCoin) => {
    this.re1.updateBtnBuyUI(currCoin);
    this.re2.updateBtnBuyUI(currCoin);
    this.re3.updateBtnBuyUI(currCoin);
    this.re4.updateBtnBuyUI(currCoin);
    this.re5.updateBtnBuyUI(currCoin);
    this.re6.updateBtnBuyUI(currCoin);
  }
}

export default ModalRescources;
