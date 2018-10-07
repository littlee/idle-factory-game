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
    this.inactiveChildren = null;

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
    this.steel = new ProductUpgradeLine({ // 名字取成和product的一致
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

    // prod4
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

  becomeActive = () => {
    this.active = true;
  }

  becomeInactive = () => {
    this.active = false;
  }
  setBigVeil4Children = () => {
    let children = [this.steel, this.drill, this.can, this.toaster];
    this.inactiveChildren = children.filter((item) => item.getActiveValue() === false);
    this.activatedChild = children.filter((item) => item.getActiveValue() === true);
    if (this.inactiveChildren.length === 4) {
      // children中没有一个有active的pie，则不需要veil
      this.becomeInactive();
      children.forEach((item) => item.makeBigVeilInvisible());
    } else if (this.inactiveChildren.length === 3) {
      // 有一个active的child, 其他的要有veil+countdown
      this.becomeActive();
      this.inactiveChildren.forEach(item => item.makeBigVeilVisible());
    }
  }

  syncCountdown4relatedChildren = (timestring) => {
    console.log('inactiveChildren.length: ', this.inactiveChildren.length);
    this.inactiveChildren.forEach(item => {
      item.resetBigCountdownTxt(timestring, this.activatedChild[0].getProdLineProductName());
    });
  }
}

export default ProductUpgradeFrame;
