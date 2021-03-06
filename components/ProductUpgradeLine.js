import ProductUpgradeItem from './ProductUpgradeItem.js';
import { CN_NAME_MAP } from '../js/config.js';

const CONFIG = {
  itemGap: 638 / 6,
  halfItemLineHeight: 100,
  frameWidth: 638,
  bigVeilPriorityID: 1002
};


function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '24px',
    fill: color || '#ffffff', // '#00FF00', 3a0a00
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

/*
控制同类product之间hightlight的变化和btns的显示:
问题：用bigVeil吃掉input, 方便但是scroll也会被吃掉。
*/

class ProductUpgradeLine extends window.Phaser.Group {
  constructor({game, frame, offsetTop, offsetLeft, product}) {
    super(game);
    this.offsetTop = offsetTop + CONFIG.halfItemLineHeight;
    this.offsetLeft = offsetLeft;
    this.product = product;
    this.highlightedIndex = null;
    this.active = false;
    this.activatedProduct = '';
    this.timeRemained = '...';
    this.frame = frame;

    this._getInit();
    this._addAllChildren();
    this._initUI();
  }

  _getInit = () => {
    this.y = this.offsetTop;
    this.x = this.offsetLeft;

    this.bigVeilGroup = this.game.make.group();

    this.base = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 0.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'base',
      incrementPercentage: '30%',
    });

    this.copper = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 1.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'bronze',
      countDownDuration: '1h2m',
      incrementPercentage: '30%',
    });

    this.silver = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 2.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'silver',
      incrementPercentage: '80%',
    });

    this.gold = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 3.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'gold',
      incrementPercentage: '150%',
    });

    this.jade = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 4.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'jade',
      incrementPercentage: '250%',
    });

    this.rubber = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 5.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'ruby',
      incrementPercentage: '400%'
    });

    this.bigVeil = this.game.make.graphics(0, 0);
    this.bigVeil.beginFill(0x000000, 0.7);
    this.bigVeil.drawRect(0, -80, CONFIG.frameWidth, CONFIG.halfItemLineHeight * 2 - 20);
    this.bigVeil.endFill();

    this.bigVeilClock = this.game.make.image(0, 0, 'clock_yellow');
    this.bigVeilClock.alignTo(this.bigVeil, Phaser.TOP_LEFT, -150, -45);

    this.bigCountdownTxt = this.game.make.text(0, 0, '研究中...' + this.timeRemained, getFontStyle());
    this.bigCountdownTxt.alignTo(this.bigVeilClock, Phaser.RIGHT_BOTTOM, 20, -this.bigVeilClock.height / 4);

    this.bigVeilGroup.addChild(this.bigVeil);
    this.bigVeilGroup.addChild(this.bigVeilClock);
    this.bigVeilGroup.addChild(this.bigCountdownTxt);

    this.bigVeilGroup.visible = false;

  }

  _addAllChildren = () => {
    this.addChild(this.base);
    this.addChild(this.copper);
    this.addChild(this.silver);
    this.addChild(this.gold);
    this.addChild(this.jade);
    this.addChild(this.rubber);
    this.addChild(this.bigVeilGroup);
  }

  _initUI = () => {
    this.setProperHighlightedChild();
  }

  setProperHighlightedChild = () => {
    let children = [this.base, this.copper, this.silver, this.gold, this.jade, this.rubber];

    let highlightedChild = children.filter((item) => {
      return item.getHighlightedValue() === true;
    });
    let upgradedChildren = children.filter((item) => {
      return item.getUpgradedValue() === true;
    });

    if (highlightedChild.length === 0) {
      // 当前不会有active的pie || base是active
      this.highlightedIndex = upgradedChildren.length - 1;
      children[this.highlightedIndex].makeStrokeHighlightedOnly();
    } else if (highlightedChild.length === 2) {
      // 在本有高亮时候，点击升级
      console.log('点击新升级');
      highlightedChild[0].makeStrokeRegularAndStuff();
      this.highlightedIndex = upgradedChildren.length;
    } else if (highlightedChild.length === 1) {
      // 当前有有一个active的pie
      this.highlightedIndex = upgradedChildren.length;
      // 让pie在active的时候，关闭了modal，再打开modal的时候，hightlighted的item后面的item不会开btn
      children[this.highlightedIndex + 1].closeBtns();
    }
    children.forEach((item, index) => {
      if (index > this.highlightedIndex + 1) {
        item.closeBtns();
      } else if (index < this.highlightedIndex) {
        item.makeStrokeRegularAndStuff();
      }
    });
  }

  makeNextItemBtnsShowUp = () => {
    let children = [this.base, this.copper, this.silver, this.gold, this.jade, this.rubber];
    let targetIndex = this.highlightedIndex + 1;
    // 剔除最后一个升级的情况
    if (targetIndex === children.length) return true;
    children[targetIndex].reopenBtns();
  }

  getActiveValue = () => {
    return this.active;
  }

  becomeActive = () => {
    this.active = true;
  }

  becomeInactive = () => {
    this.active = false;
  }

  makeBigVeilVisible = () => {
    this.bigVeilGroup.visible = true;

    let children = [this.base, this.copper, this.silver, this.gold, this.jade, this.rubber];
    children.forEach(item => {
      item.makeBtnsPriorityZero();
    });
  }

  makeBigVeilInvisible = () => {
    this.bigVeilGroup.visible = false;

    let children = [this.base, this.copper, this.silver, this.gold, this.jade, this.rubber];
    children.forEach(item => {
      item.makeBtnsPriorityBack2Initial();
    });
  }

  handleOwnItemBeingActivated = () => {
    this.becomeActive();
    this.makeBigVeilInvisible();
    // 需要，否则当升级非首个frame的item时，该frame之上的frames因为没有this.modal.getActivatedProduct()非null的值而变成无big veils
    // console.log('this.parent', this.parent);
    this.frame.setBigVeil4Children();
    this.frame.modal.handleBigVeils4AllFrames();
  }

  handleNoneActivatedItem = () => {
    this.becomeInactive();
    this.frame.modal.setActivatedProduct(null);
    this.frame.modal.handleBigVeils4AllFrames();
  }

  resetBigCountdownTxt = (timeString, prod) => {
    this.timeRemained = timeString;
    this.activatedProduct = prod;
    this.bigCountdownTxt.setText(CN_NAME_MAP[this.activatedProduct] + '研究中...' + this.timeRemained, true);
  }

  getProdLineProductName = () => {
    return this.product;
  }

  beIntermediate2PassActiveItem2Modal = (item) => {
    this.frame.modal.setActiveItem(item);
  }

  updateLineBtnBuyUI = (currCoin) => {
    let children = [this.base, this.copper, this.silver, this.gold, this.jade, this.rubber];
    children.forEach(item => {
      item.updateItemBtnBuyUI(currCoin);
    });
  }
}

export default ProductUpgradeLine;
