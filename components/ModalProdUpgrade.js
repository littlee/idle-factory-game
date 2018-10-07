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

/*
这个Modal 关闭了统一boost children的priortyID的代码执行，
对于要有自己input事件的game object, 要手动开input, 在用继承来的 this.priorityID 来操作 */
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
    this._getInit();
  }

  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this.getContextGroupInit();
    this._prepAfterContentGroup();
  };

  getContextGroupInit = () => {
    const OFFSET = this.headingH * 1.5;
    const LEFT = (this.w - CONFIG.frameWidth) / 2;

    // let frameCopper = this.game.make.graphics(
    //   LEFT,
    //   OFFSET + CONFIG.frameHeight * 1 + CONFIG.gap * 1
    // );
    // frameCopper.beginFill(CONFIG.frameColor);
    // frameCopper.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    // frameCopper.endFill();

    this.frameOre = new ProductUpgradeFrame({
      game: this.game,
      parent: this.contentGroup,
      offsetTop: OFFSET,
      offsetLeft: LEFT,
    });

    this.contentGroup.addChild(this.frameOre);
  };
}

export default ModalProdUpgrade;
