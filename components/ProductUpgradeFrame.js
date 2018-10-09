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
  productLineHeight: 200,
  tagImgScale: 34 / 128
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

const RESO_PRODLIST_MAP = {
  ore: ['steel', 'can', 'drill', 'toaster'],
  copper: ['battery', 'coffee_machine', 'mp3', 'speaker'],
  oilBarrel: [],
  plug: [],
  // two more 2 go
};

// 控制big veil的出现和消失
class ProductUpgradeFrame extends window.Phaser.Group {
  constructor({ game, parent, offsetTop, offsetLeft, modalRef, reso }) {
    super(game, parent);
    this.modal = modalRef;
    this.prodList = RESO_PRODLIST_MAP[reso]; // 格式 ['steel', 'can', 'drill', 'toaster']
    this.reso = reso;

    this.active = false;
    this.offsetTop = offsetTop;
    this.offsetLeft = offsetLeft;
    this.inactiveChildren = null;
    this.activatedChild = null;
    this.activatedProduct = null;

    this._getInit();
    this._addAllChildren();
  }

  _getInit = () => {
    // frame
    this.frame = this.game.make.graphics(this.offsetLeft, this.offsetTop);
    this.frame.beginFill(CONFIG.frameColor);
    this.frame.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    this.frame.endFill();

    // tag bg
    this.tag = this.game.make.graphics(0, 0);
    this.tag.beginFill(CONFIG.frameTagColor);
    this.tag.drawRect(0, 0, CONFIG.frameTagW, CONFIG.frameTagH);
    this.tag.endFill();
    // tag stroke
    this.tag.lineStyle(CONFIG.frameTagStroke, CONFIG.frameTagStrokeC);
    this.tag.moveTo(0, 0);
    this.tag.lineTo(CONFIG.frameTagW, 0);
    this.tag.lineTo(CONFIG.frameTagW, CONFIG.frameTagH);
    this.tag.lineTo(0, CONFIG.frameTagH);
    this.tag.lineTo(0, 0);
    this.tag.alignTo(this.frame, Phaser.TOP_LEFT, -10, -15);

    // tag name txt
    this.tagName = this.game.make.text(
      0,
      0,
      '铁矿',
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight
    this.tagName.alignTo(
      this.tag,
      Phaser.BOTTOM_LEFT,
      -20,
      -CONFIG.frameTagH
    );

    // tag img
    this.tagImg = this.game.make.image(0, 0, `reso_${this.reso}`);
    this.tagImg.scale.x = CONFIG.tagImgScale;
    this.tagImg.scale.y = CONFIG.tagImgScale;
    this.tagImg.alignTo(this.tagName, Phaser.RIGHT_BOTTOM, 5, -5);

    // prod1
    this.prod1 = new ProductUpgradeLine({
      // 名字取成和product的一致
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop,
      offsetLeft: this.offsetLeft,
      product: this.prodList[0]
    });

    // prod2
    this.prod2 = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight,
      offsetLeft: this.offsetLeft,
      product: this.prodList[1]
    });

    // prod3
    this.prod3 = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight * 2,
      offsetLeft: this.offsetLeft,
      product: this.prodList[2]
    });

    // prod4
    this.prod4 = new ProductUpgradeLine({
      game: this.game,
      parent: this,
      offsetTop: this.offsetTop + CONFIG.productLineHeight * 3,
      offsetLeft: this.offsetLeft,
      product: this.prodList[3]
    });
  };

  _addAllChildren = () => {
    this.addChild(this.frame);
    this.addChild(this.tag);
    this.addChild(this.tagName);
    this.addChild(this.tagImg);
    this.addChild(this.prod1);
    this.addChild(this.prod2);
    this.addChild(this.prod3);
    this.addChild(this.prod4);
  };

  becomeActive = () => {
    this.active = true;
  };

  becomeInactive = () => {
    this.active = false;
  };

  getActiveValue = () => {
    return this.active;
  };

  setBigVeil4Children = () => {
    let children = [this.prod1, this.prod2, this.prod3, this.prod4];
    this.inactiveChildren = children.filter(
      item => item.getActiveValue() === false
    );
    this.activatedChild = children.filter(
      item => item.getActiveValue() === true
    );
    if (this.activatedChild.length > 0) {
      this.activatedProduct = this.activatedChild[0].getProdLineProductName();
      this.modal.setActivatedProduct(this.activatedProduct);
    }
    if (this.inactiveChildren.length === 4) {
      // children中没有一个有active的pie，则不需要veil
      this.becomeInactive();
      if (this.modal.getActivatedProduct() !== null) {
        children.forEach(item => item.makeBigVeilVisible());
      } else {
        children.forEach(item => item.makeBigVeilInvisible());
      }
    } else if (this.inactiveChildren.length === 3) {
      // 有一个active的child, 其他的要有veil+countdown
      this.becomeActive();
      this.inactiveChildren.forEach(item => item.makeBigVeilVisible());
    }
  };

  syncCountdown4relatedChildren = timestring => {
    // 要在setBigVeil4Children()之后调用
    let product = this.modal.getActivatedProduct();
    this.inactiveChildren.forEach(item => {
      item.resetBigCountdownTxt(timestring, product);
    });
  };

  getActivatedProduct = () => {
    return this.activatedProduct;
  };
}

export default ProductUpgradeFrame;
