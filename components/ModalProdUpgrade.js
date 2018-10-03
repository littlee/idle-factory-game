import ModalRaw from './ModalRaw.js';
import ProductUpgradeItem from './ProductUpgradeItem.js';

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '18px',
    fill: color || '#3A0A00', // '#00FF00', 3a0a00
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

const CONFIG = {
  frameTagStroke: 6,
  frameTagStrokeC: 0xffc131,
  frameHeight: 792,
  frameWidth: 638,
  frameColor: 0xb4a59d,
  frameTagW: 134,
  frameTagH: 58,
  frameTagColor: 0xcb6000,
  frameVeilH: 174,
  prodStrokeWidth: 4,
  prodRegularStrokeColor: 0x03832e,  // 0x03832e
  prodHighlightedStrokeColor: 0X39ec43,
  bubbleColor: 0x004818,
  gap: 100,
  connectlineH: 4,
  clockScaleFactor: 0.4
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

    // fix me: 每个原料的frame改成一个组件
    // draw frame for each resource
    let frameOre = this.game.make.graphics(
      LEFT,
      OFFSET
    );
    frameOre.beginFill(CONFIG.frameColor);
    frameOre.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    frameOre.endFill();

    let frameCopper = this.game.make.graphics(
      LEFT,
      OFFSET + CONFIG.frameHeight * 1 + CONFIG.gap * 1
    );
    frameCopper.beginFill(CONFIG.frameColor);
    frameCopper.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    frameCopper.endFill();

    let frameOilBarrel = this.game.make.graphics(
      LEFT,
      OFFSET + CONFIG.frameHeight * 2 + CONFIG.gap * 2
    );
    frameOilBarrel.beginFill(CONFIG.frameColor);
    frameOilBarrel.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    frameOilBarrel.endFill();

    let framePlug = this.game.make.graphics(
      LEFT,
      CONFIG.frameHeight * 3 + CONFIG.gap * 3
    );
    framePlug.beginFill(CONFIG.frameColor);
    framePlug.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    framePlug.endFill();

    let frameAlBar = this.game.make.graphics(
      LEFT,
      CONFIG.frameHeight * 4 + CONFIG.gap * 4
    );
    frameAlBar.beginFill(CONFIG.frameColor);
    frameAlBar.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    frameAlBar.endFill();

    let frameRubber = this.game.make.graphics(
      LEFT,
      CONFIG.frameHeight * 5 + CONFIG.gap * 5
    );
    frameRubber.beginFill(CONFIG.frameColor);
    frameRubber.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    frameRubber.endFill();

    // draw tag for each frame
    let tagOre = this.game.make.graphics(0, 0);
    tagOre.beginFill(CONFIG.frameTagColor);
    tagOre.drawRect(0, 0, CONFIG.frameTagW, CONFIG.frameTagH);
    tagOre.endFill();

    tagOre.lineStyle(CONFIG.frameTagStroke, CONFIG.frameTagStrokeC);
    tagOre.moveTo(0, 0);
    tagOre.lineTo(CONFIG.frameTagW, 0);
    tagOre.lineTo(CONFIG.frameTagW, CONFIG.frameTagH);
    tagOre.lineTo(0, CONFIG.frameTagH);
    tagOre.lineTo(0, 0);

    tagOre.alignTo(frameOre, Phaser.TOP_LEFT, -10, -15);

    let tagOreName = this.game.make.text(
      0,
      0,
      '铁矿',
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight
    tagOreName.alignTo(tagOre, Phaser.BOTTOM_LEFT, -20, -CONFIG.frameTagH);
    let tagOreImg = this.game.make.image(0, 0, 'reso_ore');
    tagOreImg.scale.x = 0.65;
    tagOreImg.scale.y = 0.65;
    tagOreImg.alignTo(tagOreName, Phaser.RIGHT_BOTTOM, 5, -5);

    let tagCopper = this.game.make.graphics(0, 0);
    tagCopper.beginFill(CONFIG.frameTagColor);
    tagCopper.drawRect(0, 0, CONFIG.frameTagW, CONFIG.frameTagH);
    tagCopper.endFill();

    tagCopper.lineStyle(CONFIG.frameTagStroke, CONFIG.frameTagStrokeC);
    tagCopper.moveTo(0, 0);
    tagCopper.lineTo(CONFIG.frameTagW, 0);
    tagCopper.lineTo(CONFIG.frameTagW, CONFIG.frameTagH);
    tagCopper.lineTo(0, CONFIG.frameTagH);
    tagCopper.lineTo(0, 0);

    tagCopper.alignTo(frameCopper, Phaser.TOP_LEFT, -10, -15);

    let tagCopperName = this.game.make.text(
      0,
      0,
      '铁矿',
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight
    tagCopperName.alignTo(
      tagCopper,
      Phaser.BOTTOM_LEFT,
      -20,
      -CONFIG.frameTagH
    );
    let tagCopperImg = this.game.make.image(0, 0, 'reso_ore');
    tagCopperImg.scale.x = 0.65;
    tagCopperImg.scale.y = 0.65;
    tagCopperImg.alignTo(tagCopperName, Phaser.RIGHT_BOTTOM, 5, -5);

    // production update chain
    this.steelGroup = new ProductUpgradeItem({
      game: this.game,
      x: LEFT + 60,
      y: OFFSET + 120,
      product: 'steel',
      bought: true
    });

    this.drillGroup = new ProductUpgradeItem({
      game: this.game,
      x: LEFT + 60,
      y: OFFSET + 120,
      product: 'steel',
      bought: true
    });

    this.contentGroup.addChild(frameOre);
    this.contentGroup.addChild(frameCopper);
    this.contentGroup.addChild(frameOilBarrel);
    this.contentGroup.addChild(framePlug);
    this.contentGroup.addChild(frameAlBar);
    this.contentGroup.addChild(frameRubber);
    this.contentGroup.addChild(tagOre);
    this.contentGroup.addChild(tagOreName);
    this.contentGroup.addChild(tagOreImg);
    this.contentGroup.addChild(tagCopper);
    this.contentGroup.addChild(tagCopperName);
    this.contentGroup.addChild(tagCopperImg);

    // test
    this.contentGroup.addChild(this.steelGroup);
    this.contentGroup.addChild(this.drillGroup);
  };
}

export default ModalProdUpgrade;
