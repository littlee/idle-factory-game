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
    'copper': '100000',
    'barrel': '2000000', //'3000000',
    'plug': '3000000000', //'4000000000',
    'aluminium': '500000000000000', //'5000000000000',
    'rubber': '90000000000000000', //'6000000000000000'
  },
};

// item初始化的数据来自resourceTable, viz., warehouse
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
    this._getContextGroupInit();

    this._prepAfterContentGroup();
  };

  _getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    let resoList = ['ore', 'copper', 'barrel', 'plug', 'aluminium', 'rubber'];
    resoList.forEach((item, index) => {
      this[`re${index + 1}`] = new ResourceItem({
        game: this.game,
        parent: this.contentGroup,
        key: `reso_${item}`,
        pWidth: this.w,
        y: OFFSET + 85 * index + 17 * index,
        resourcesTable: this.resourcesTable,
        coinNeeded: CONFIG.priceTags[item],
        cashNeeded: null
      });
    });
  }

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
