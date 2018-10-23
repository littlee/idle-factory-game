import ModalRaw from './ModalRaw.js';
import ProdPickFrame from './ProdPickFrame.js';

import range from '../js/libs/_/range';

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
    let resoList = ['ore', 'copper', 'barrel', 'plug', 'aluminium', 'plug'];
    this.frameGroup = this.game.make.group();

    range(6).forEach( item => {
      this[`frame${item}`] = new ProdPickFrame({
        game: this.game,
        reso: resoList[item],
        parentWidth: this.w,
        offsetTop: OFFSET * 1.5 + (405 + 50) * item
      });
      this.frameGroup.addChild(this[`frame${item}`]);
    });
    this._addAllChildren();
  };


  _addAllChildren = () => {
    this.contentGroup.addChild(this.frameGroup);
  };

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };
}

export default ModalProdPick;
