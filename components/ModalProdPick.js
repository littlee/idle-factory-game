import ModalRaw from './ModalRaw.js';
import ProdPickFrame from './ProdPickFrame.js';

import range from '../js/libs/_/range';

// frame是否解锁初始信息来自resourceTable, 即warehouse
class ModalProdPick extends ModalRaw {
  constructor({
    game,
    headingTxt = '选择生产',
    scrollable = true,
    boost = false,
    contentMargin = 100,
    workstation,
    resourcesTable,
    close = 'destory'
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
      contentMargin,
      close
    );
    // has inherited this.w this.h
    this.state = this.game.state.states[this.game.state.current];
    this.activatedProdKey = null;
    this.workstation = workstation;
    this.workstationOutput = this.workstation.getOutputKey();

    this.currResoList = resourcesTable.getCurrentGoods();
    console.log('this.currResoList',  this.currResoList);
    this._getInit();

    // 因为现在是关闭就destroy, 所以，在init的时候，需要自行先去初始化所有btn的正确UI。
    let currCoin = this.state.getCurrCoin();
    this.getAllBtnCoinUpdated(currCoin);
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this._getContextGroupInit();
    this._prepAfterContentGroup();
  };

  _addAllChildren = () => {
    this.contentGroup.addChild(this.frameGroup);
  };

  // 注意modal的属性名称不能和raw的collapse
  _getContextGroupInit = () => {
    const OFFSET = this.headingH;
    this.frameGroup = this.game.make.group();
    let resoList = ['ore', 'copper', 'barrel', 'plug', 'aluminium', 'rubber'];

    resoList.forEach((item, index) => {
      this[`frame${index}`] = new ProdPickFrame({
        game: this.game,
        reso: item,
        unlocked: this.currResoList.indexOf(item) > -1,
        parentWidth: this.w,
        offsetTop: OFFSET * 1.5 + (405 + 50) * index,
        modal: this
      });
      this.frameGroup.addChild(this[`frame${index}`]);
    });
    this._addAllChildren();
  };

  updateTexture = (prodName) => {
    range(6).forEach((item) => {
      console.log('modal prodPick update');
      this[`frame${item}`].updateItemTexture(prodName);
    });
  }

  getCurrActivatedProd = () => {
    return this.activatedProdKey;
  };

  getAllBtnCoinUpdated = (currCoin) => {
    this.frameGroup.children.forEach(item => {
      item.getAllItemBtnCoinUpdated(currCoin);
    });
  };

  deactivateCurrActiveFrame = () => {
    let frame = this.frameGroup.children.find(item => item.active === true);
    if (frame === undefined) return false;
    frame
      .deactivateCurrActiveItem()
      .deactivateFrame();
  }

  setCurrActivatedProd = (item) => {
    this.activatedProdKey = item;
    this.workstation.setOutput(this.activatedProdKey);
  }

}

export default ModalProdPick;
