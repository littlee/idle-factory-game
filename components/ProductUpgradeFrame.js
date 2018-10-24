import ProductUpgradeLine from './ProductUpgradeLine';

const CONFIG = {
  frameTagStroke: 6,
  frameTagStrokeC: 0xffc131,
  frameHeight: 830,
  frameHeightUnit: 830 / 4,
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

// 这个表需要每个workstation都有，然后这里可以去拿到。how？作为这里group的属性之一，然后父modal可以来改动它？
const RESO_PRODLIST_MAP = {
  ore: ['steel', 'can', 'drill', 'toaster'],
  copper: ['battery', 'coffee_machine'],
  oilBarrel: [],
  plug: [],
  aluminium: [],
  rubber: []
};

const RESO_TAGNAME_MAP = {
  ore: '铁矿',
  copper: '黄铜',
  oilBarrel: '油桶',
  plug: '电器',
  aluminium: '铝器',
  rubber: '橡胶'
};

// 控制big veil的出现和消失
class ProductUpgradeFrame extends window.Phaser.Group {
  constructor({ game, parent, offsetTop, offsetLeft, modalRef, reso }) {
    super(game, parent);
    this.modal = modalRef;
    this.prodList = RESO_PRODLIST_MAP[reso]; // 格式 ['steel', 'can', 'drill', 'toaster']
    this.reso = reso;
    this.tagCnName = RESO_TAGNAME_MAP[reso];

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
    // this.frame.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    this.frame.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeightUnit * this.prodList.length);
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
      this.tagCnName,
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

    this.prodGroup = this.game.make.group();
    this.prodList.forEach((item, index) => {
      this[`prod${index}`] = new ProductUpgradeLine({
        // 名字取成和product的一致
        game: this.game,
        frame: this,
        offsetTop: this.offsetTop + CONFIG.productLineHeight * index,
        offsetLeft: this.offsetLeft,
        product: this.prodList[index]
      });
      this.prodGroup.addChild(this[`prod${index}`]);
    });
  };

  _addAllChildren = () => {
    this.addChild(this.frame);
    this.addChild(this.tag);
    this.addChild(this.tagName);
    this.addChild(this.tagImg);
    this.addChild(this.prodGroup);
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
    let children = this.prodGroup.children;
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

  updateFrameBtnBuyUI = (currCoin) => {
    let children = this.prodGroup.children;
    children.forEach(item => {
      item.updateLineBtnBuyUI(currCoin);
    });
  };
}

export default ProductUpgradeFrame;
