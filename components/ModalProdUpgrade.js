import ModalRaw from './ModalRaw.js';

function getFontStyle (fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '16px',
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

const CONFIG = {

};

class ModalProdUpgrade extends ModalRaw {
  constructor({game, headingTxt, headingH = 130, subHeading = true}) {
    // parems
    super(game, headingTxt, undefined, undefined, undefined, undefined, undefined, headingH, subHeading);
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
     const OFFSET = this.headingH;

  }
}

export default ModalProdUpgrade;
