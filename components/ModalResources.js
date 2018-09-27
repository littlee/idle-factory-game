import ModalRaw from './ModalRaw.js';
import ResourceItem from './ResourceItem';

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '34px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
};

const CONFIG = {
  width: 500,
  height: 717
};

class ModalRescources extends ModalRaw {
  constructor({game, height = CONFIG.height, width = CONFIG.width, headingTxt, headingStyles = FONT_STYLE, scrollable}) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;

    this._getInit();
  }

  _getInit = () => {
    this._positionModal();
    this._createOuterVeil();
    this._DrawSubGroupStuff();

    this._setMask4ContentGroup();
    /* real content goes here */
    this.getContextGroupInit();

    this._addStuff2SubGroup();
    this._addStuff2Modal();

    this._boostInputPriority4Children();
    // prep for scrolling, should be called after contentGroup is all set
    this._getScrollWhenNeeded();
  }

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;
    let re1 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_ore',
      pWidth: this.w,
      y : OFFSET,
      bought: true
    });

    let re2 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_copper',
      pWidth: this.w,
      y : OFFSET + 85 + 17,
      bought: true
    });

    let re3 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_barrel',
      pWidth: this.w,
      y : OFFSET + 85 * 2 + 17 * 2,
      bought: true
    });

    let re4 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_plug',
      pWidth: this.w,
      y : OFFSET + 85 * 3 + 17 * 3,
      // bought: true
    });

    let re5 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_aluminium',
      pWidth: this.w,
      y : OFFSET + 85 * 4 + 17 * 4,
      // bought: true
    });

    let re6 = new ResourceItem({
      game: this.game,
      parent: this.contentGroup,
      key: 'reso_rubber',
      pWidth: this.w,
      y : OFFSET + 85 * 5 + 17 * 5,
      // bought: true
    });

  }

}

export default ModalRescources;
