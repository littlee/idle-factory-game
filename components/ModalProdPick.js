import ModalRaw from './ModalRaw.js';
import ProdPickFrame from './ProdPickFrame.js';

// control the UI of a raw-material-frame
class ModalProdPick extends ModalRaw {
  constructor({
    game,
    headingTxt = '选择生产',
    scrollable = true,
    boost = false,
    contentMargin = 100
  }) {
    super(
      game,
      headingTxt,
      undefined,
      undefined,
      scrollable,
      undefined,
      undefined,
      undefined,
      undefined,
      boost,
      contentMargin
    );
    // has inherited this.w this.h

    this._getInit();
  }

  // 注意modal的属性名称不能和raw的collapse
  getContextGroupInit = () => {
    const OFFSET = this.headingH;
    // frame
    this.frameOre = new ProdPickFrame({
      game: this.game,
      reso: 'ore',
      parentWidth: this.w,
      offsetTop: OFFSET * 1.5
    });
    this.frameCopper = new ProdPickFrame({
      game: this.game,
      reso: 'copper',
      parentWidth: this.w,
      offsetTop: OFFSET * 1.5 + 405 + 50
    });
    this._addAllChildren();
  };


  _addAllChildren = () => {
    this.contentGroup.addChild(this.frameOre);
    this.contentGroup.addChild(this.frameCopper);
  };

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };
}

export default ModalProdPick;
