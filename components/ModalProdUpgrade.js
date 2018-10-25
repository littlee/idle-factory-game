import ModalRaw from './ModalRaw.js';
import ProductUpgradeFrame from './ProductUpgradeFrame.js';

const CONFIG = {
  frameTagStroke: 6,
  frameTagStrokeC: 0xffc131,
  frameHeight: 830,
  frameWidth: 638,
  frameColor: 0xb4a59d,
  frameTagW: 134,
  frameTagH: 58,
  frameTagColor: 0xcb6000,
  frameVeilH: 174,
  gap: 100,
  connectlineH: 4,
};

// todo: 1）明确配置和输出；

/*
这个Modal 关闭了统一boost children的priortyID的代码执行，
对于要有自己input事件的game object, 要手动开input, 在用继承来的 this.priorityID 来操作
*/
class ModalProdUpgrade extends ModalRaw {
  constructor({
    game,
    headingTxt,
    width = 675,
    headingH = 130,
    subHeading = true,
    scrollable = true,
    boost = false,
    contentMargin = 100,
    upgradeMap,
    close
  }) {
    // parems
    super(
      game,
      headingTxt,
      undefined,
      width,
      scrollable,
      undefined,
      undefined,
      headingH,
      subHeading,
      boost,
      contentMargin,
      close
    );
    this.state = this.game.state.states[this.game.state.current];
    this.activeItem = null;

    this.activatedProduct = null;
    this.upgradeMap = upgradeMap;
    this.resoList = Object.keys(upgradeMap);
    this._getInit();
    this._addMoreModalCloseHandler();

    // 因为现在是关闭就destroy, 所以，在init的时候，需要自行先去初始化所有btn的正确UI。
    let currCoin = this.state.getCurrCoin();
    this.updateModalAllBtnBuyUI(currCoin);
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this._getContextGroupInit();
    this._prepAfterContentGroup();
  };

 // 扩展关闭modal的handlers
  _addMoreModalCloseHandler = () => {
    // 吧当前draw的指引拿到。。。。
    let target = [this.btnClose, this.veilTop, this.veilDown, this.veil];
    target.forEach(item => {
      item.events.onInputDown.add(() => {
        console.log('inherited first');
        if (this.activeItem !== null) {
          this.activeItem.clearAllTimer();
        }
      }, this, 1000);
    });
  }

  setActivatedProduct = (prod) => {
    this.activatedProduct = prod;
  }

  getActivatedProduct = () => {
    return this.activatedProduct;
  }

  _getContextGroupInit = () => {
    const OFFSET = this.headingH * 1.5;
    const LEFT = (this.w - CONFIG.frameWidth) / 2;

    this.frameGroup = this.game.make.group();
    this.resoList.forEach((item, index) => {
      if (this.upgradeMap[item].length > 0) {
        this[`frame${index}`] = new ProductUpgradeFrame({
          game: this.game,
          parent: this.contentGroup,
          offsetTop: OFFSET + CONFIG.frameHeight * index + CONFIG.gap * index,
          offsetLeft: LEFT,
          modalRef: this,
          reso: item,
          upgradeMap: this.upgradeMap,
        });
        this.frameGroup.addChild(this[`frame${index}`]);
      }
    });
    this.contentGroup.addChild(this.frameGroup);
  };

  handleBigVeils4AllFrames = () => {
    // 如果frame的visible是false的话，可以考虑着这里做处理
    this.frameGroup.children.forEach(item => {
      item.setBigVeil4Children();
    });
  }


  handleCountdown4AllFrames = (timestring) => {
    // should be invoked after this.handleBigVeils4AllFrames()
    this.frameGroup.children.forEach((item, index) => {
      item.syncCountdown4relatedChildren(timestring);
    });
  }

  updateModalAllBtnBuyUI = (currCoin) => {
    this.frameGroup.children.forEach(item => {
      item.updateFrameBtnBuyUI(currCoin);
    });
  }

  setActiveItem = (item) => {
    this.activeItem = item;
  }
}

export default ModalProdUpgrade;
