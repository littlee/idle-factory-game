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
  priceTags: {},
};

class ModalRescources extends ModalRaw {
  constructor({
    game,
    height = CONFIG.height,
    width = CONFIG.width,
    headingTxt,
    headingStyles = FONT_STYLE,
    scrollable
  }) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;

    this._getInit();
  }

  _getInit = () => {
    this._positionModal();
    this._createOuterVeil();
    this._drawSubGroupStuff();

    this._setMask4ContentGroup();
    /* real content goes here */
    this.getContextGroupInit();

    this._addStuff2SubGroup();
    this._addStuff2Modal();

    this._boostInputPriority4Children();
    // prep for scrolling, should be called after contentGroup is all set
    this._getScrollWhenNeeded();
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
      bought: true,
      coinNeeded: null,
      cashNeeded: null
    });

    this.re2 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_copper',
      pWidth: this.w,
      y: OFFSET + 85 + 17,
      bought: true,
      coinNeeded: null,
      cashNeeded: null
    });

    this.re3 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_barrel',
      pWidth: this.w,
      y: OFFSET + 85 * 2 + 17 * 2,
      bought: true,
      coinNeeded: null,
      cashNeeded: null
    });

    this.re4 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_plug',
      pWidth: this.w,
      y: OFFSET + 85 * 3 + 17 * 3,
      // bought: true,
      coinNeeded: null,
      cashNeeded: null
    });

    this.re5 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_aluminium',
      pWidth: this.w,
      y: OFFSET + 85 * 4 + 17 * 4,
      // bought: true,
      coinNeeded: null,
      cashNeeded: null
    });

    this.re6 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_rubber',
      pWidth: this.w,
      y: OFFSET + 85 * 5 + 17 * 5,
      // bought: true,
      coinNeeded: null,
      cashNeeded: null
    });
  }

  getAvailableResources = () => {
    let availableResourcesList = [];
    for (let i=1; i<7; i++) {
      if (this['re'+i].isBought()) {
        availableResourcesList.push(this['re'+i].getTarget());
      }
    }
    return availableResourcesList;
  }

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
}

export default ModalRescources;
