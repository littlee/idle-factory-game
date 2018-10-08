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

// todo: 1）UI的更新timer要改，不要1s更一次；2）明确配置和输出；

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
    contentMargin = 100
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
      contentMargin
    );
    this.activatedProduct = null;
    this._getInit();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };

  setActivatedProduct = (prod) => {
    this.activatedProduct = prod;
  }

  getActivatedProduct = () => {
    return this.activatedProduct;
  }

  getContextGroupInit = () => {
    const OFFSET = this.headingH * 1.5;
    const LEFT = (this.w - CONFIG.frameWidth) / 2;

    this.frameOre = new ProductUpgradeFrame({
      game: this.game,
      parent: this.contentGroup,
      offsetTop: OFFSET,
      offsetLeft: LEFT,
      modalRef: this,
    });

    this.frameCopper = new ProductUpgradeFrame({
      game: this.game,
      parent: this.contentGroup,
      offsetTop: OFFSET + CONFIG.frameHeight * 1 + CONFIG.gap * 1,
      offsetLeft: LEFT,
      modalRef: this,
    });

    this.framesOilBarrel = new ProductUpgradeFrame({
      game: this.game,
      parent: this.contentGroup,
      offsetTop: OFFSET + CONFIG.frameHeight * 2 + CONFIG.gap * 2,
      offsetLeft: LEFT,
      modalRef: this,
    });

    this.contentGroup.addChild(this.frameOre);
    this.contentGroup.addChild(this.frameCopper);
    this.contentGroup.addChild(this.framesOilBarrel);
  };

  handleBigVeils4AllFrames = () => {
    let children = [this.frameOre, this.frameCopper, this.framesOilBarrel];
    children.forEach(item => {
      item.setBigVeil4Children();
    });
  }

  handleCountdown4AllFrames = (timestring) => {
    // should be invoked after this.handleBigVeils4AllFrames()
    let children = [this.frameOre, this.frameCopper, this.framesOilBarrel];
    children.forEach(item => {
      item.syncCountdown4relatedChildren(timestring);
    });
  }
}

export default ModalProdUpgrade;
