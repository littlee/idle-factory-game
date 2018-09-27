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
  frameHeight: 792,
  frameWidth: 638,
  frameColor: 0xb4a59d,
  frameTagW: 134,
  frameTagH: 58,
  frameVeilH: 174,
  gap: 100,
  prodWidth: 84,
  prodHeight: 84,
  prodStrokeColor: 0x006e0c,
  prodStrokeWidth: 1,
  connectlineH: 4,
  clockScaleFactor: 0.4
};

/*
这个Modal 关闭了统一boost children的priortyID的代码执行，
对于要有自己input事件的game object, 要手动开input, 在用继承来的 this.priorityID 来操作 */
class ModalProdUpgrade extends ModalRaw {
  constructor({game, headingTxt, width = 675, headingH = 130, subHeading = true, scrollable = true, boost = false}) {
    // parems
    super(game, headingTxt, undefined, width, scrollable, undefined, undefined, headingH, subHeading, boost);
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
     let frameOre = this.game.make.graphics(0, OFFSET);
     frameOre.beginFill(CONFIG.frameColor);
     frameOre.drawRect((this.w - CONFIG.frameWidth) / 2, 0, CONFIG.frameWidth, CONFIG.frameHeight);
     frameOre.endFill();

     let frameCopper = this.game.make.graphics(0, OFFSET);
     frameCopper.beginFill(CONFIG.frameColor);
     frameCopper.drawRect((this.w - CONFIG.frameWidth) / 2, CONFIG.frameHeight * 1 + CONFIG.gap * 1, CONFIG.frameWidth, CONFIG.frameHeight);
     frameCopper.endFill();

     let frameOilBarrel = this.game.make.graphics(0, OFFSET);
     frameOilBarrel.beginFill(CONFIG.frameColor);
     frameOilBarrel.drawRect((this.w - CONFIG.frameWidth) / 2, CONFIG.frameHeight * 3 + CONFIG.gap * 3, CONFIG.frameWidth, CONFIG.frameHeight);
     frameOilBarrel.endFill();

     let framePlug = this.game.make.graphics(0, OFFSET);
     framePlug.beginFill(CONFIG.frameColor);
     framePlug.drawRect((this.w - CONFIG.frameWidth) / 2, CONFIG.frameHeight * 4 + CONFIG.gap * 4, CONFIG.frameWidth, CONFIG.frameHeight);
     framePlug.endFill();

     let frameAlBar = this.game.make.graphics(0, OFFSET);
     frameAlBar.beginFill(CONFIG.frameColor);
     frameAlBar.drawRect((this.w - CONFIG.frameWidth) / 2, CONFIG.frameHeight * 5 + CONFIG.gap * 5, CONFIG.frameWidth, CONFIG.frameHeight);
     frameAlBar.endFill();

     let frameRubber = this.game.make.graphics(0, OFFSET);
     frameRubber.beginFill(CONFIG.frameColor);
     frameRubber.drawRect((this.w - CONFIG.frameWidth) / 2, CONFIG.frameHeight * 6 + CONFIG.gap * 6, CONFIG.frameWidth, CONFIG.frameHeight);
     frameRubber.endFill();

     this.contentGroup.addChild(frameOre);
     this.contentGroup.addChild(frameCopper);
  }
}

export default ModalProdUpgrade;
