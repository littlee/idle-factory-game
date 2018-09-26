import ModalRaw from './ModalRaw.js';
import ResourceItem from './ResourceItem';

const LEVEL = {
  aWidth: 537,
  aHeight: 178,
  desHeight: 85
};

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '34px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
};

function getFontStyle (fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize,
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

/*
opts = {
  avatarImg: <key>,
  avatarHeading: string,
  avatarDes: string,
  item1Icon: <key>,
  item1Des: string
}
*/
class ModalRescources extends ModalRaw {
  constructor({game, height = 717, width = 500, headingTxt, headingStyles = FONT_STYLE, scrollable, opts}) {
    // parems
    super(game, headingTxt, height, width, scrollable, headingStyles);
    this.w = width;
    this.h = height;
    // this.opts = opts;
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
      key: 'source_ore',
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
