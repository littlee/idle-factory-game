import ProductUpgradeLine from './ProductUpgradeLine';

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
  productLineHeight: 200
};

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

// 控制big veil的出现和消失
class ProductUpgradeFrame extends window.Phaser.Group {
  constructor({game, parent, offsetTop, offsetLeft}) {
    super(game, parent);

    this.active = false;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;

    this._getInit();
    this._addAllChildren();
  }

  _getInit = () => {
    // frame
    this.frameOre = this.game.make.graphics(
      this.offsetLeft,
      this.offsetTop
    );
    this.frameOre.beginFill(CONFIG.frameColor);
    this.frameOre.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    this.frameOre.endFill();

    // tag bg
    this.tagOre = this.game.make.graphics(0, 0);
    this.tagOre.beginFill(CONFIG.frameTagColor);
    this.tagOre.drawRect(0, 0, CONFIG.frameTagW, CONFIG.frameTagH);
    this.tagOre.endFill();
    // tag stroke
    this.tagOre.lineStyle(CONFIG.frameTagStroke, CONFIG.frameTagStrokeC);
    this.tagOre.moveTo(0, 0);
    this.tagOre.lineTo(CONFIG.frameTagW, 0);
    this.tagOre.lineTo(CONFIG.frameTagW, CONFIG.frameTagH);
    this.tagOre.lineTo(0, CONFIG.frameTagH);
    this.tagOre.lineTo(0, 0);
    this.tagOre.alignTo(this.frameOre, Phaser.TOP_LEFT, -10, -15);

    // tag name txt
    this.tagOreName = this.game.make.text(
      0,
      0,
      '铁矿',
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight
    this.tagOreName.alignTo(this.tagOre, Phaser.BOTTOM_LEFT, -20, -CONFIG.frameTagH);

    // tag img
    this.tagOreImg = this.game.make.image(0, 0, 'reso_ore');
    this.tagOreImg.scale.x = 0.65;
    this.tagOreImg.scale.y = 0.65;
    this.tagOreImg.alignTo(this.tagOreName, Phaser.RIGHT_BOTTOM, 5, -5);

    // prod1
    this.steel = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop,
      offsetLeft: this.offsetLeft,
      product: 'steel',
    });

    // prod2
    this.drill = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight,
      offsetLeft: this.offsetLeft,
      product: 'steel',
    });

    // prod3
    this.can = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight * 2,
      offsetLeft: this.offsetLeft,
      product: 'steel',
    });

    // prod2
    this.toaster = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight * 3,
      offsetLeft: this.offsetLeft,
      product: 'steel',
    });
  }

  _addAllChildren = () => {
    this.addChild(this.frameOre);
    this.addChild(this.tagOre);
    this.addChild(this.tagOreName);
    this.addChild(this.tagOreImg);
    this.addChild(this.steel);
    this.addChild(this.drill);
    this.addChild(this.can);
    this.addChild(this.toaster);
  }
}

export default ProductUpgradeFrame;
