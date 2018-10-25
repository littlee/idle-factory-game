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
    contentMargin = 100,
    workstation,
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
    this.activatedProdKey = null;
    this.workstation = workstation;
    this.resoList = [
      { name: 'ore',
        unlocked: true
      },
      { name: 'copper',
        unlocked: false
      },
      { name: 'barrel',
        unlocked: false
      },
      { name: 'plug',
        unlocked: false
      },
      { name: 'aluminium',
        unlocked: false
      },
      { name: 'rubber',
        unlocked: false
      }
    ];
    this._getInit();
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

    range(6).forEach((item) => {
      this[`frame${item}`] = new ProdPickFrame({
        game: this.game,
        reso: this.resoList[item].name,
        unlocked: this.resoList[item].unlocked,
        parentWidth: this.w,
        offsetTop: OFFSET * 1.5 + (405 + 50) * item,
        modal: this
      });
      this.frameGroup.addChild(this[`frame${item}`]);
    });
    this._addAllChildren();
  };

  updateResoList = (newGoodsList) => {
    // get curr added reso
    let currAddedReso = newGoodsList[newGoodsList.length - 1];
    let targetIdx = this.resoList.findIndex(item => {
      return item.name === currAddedReso;
    });
    this.resoList[targetIdx].unlocked = true;
    this[`frame${targetIdx}`].getUnlocked();
  };

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
