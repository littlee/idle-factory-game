import ProductUpgradeItem from './ProductUpgradeItem.js';

const CONFIG = {
  itemGap: 638 / 6,
  halfItemLineHeight: 100
};

// 控制同类product之间hightlight的变化和btns的显示
class ProductUpgradeLine extends window.Phaser.Group {
  constructor({game, parent, offsetTop, offsetLeft, product}) {
    super(game, parent);
    this.offsetTop = offsetTop + CONFIG.halfItemLineHeight;
    this.offsetLeft = offsetLeft;
    this.product = product;
    this.highlightedIndex = null;
    this.active = false;

    this._getInit();
    this._addAllChildren();
    this._initUI();
  }

  _getInit = () => {
    this.y = this.offsetTop;
    this.x = this.offsetLeft;
    this.base = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 0.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'base',
      countDownDuration: '0s',
      pieActivatedTimestamp: 1538820968140,
      incrementPercentage: '20%',
    });

    this.copper = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 1.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'copper',
    });

    this.silver = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 2.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'silver',
    });

    this.gold = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 3.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'gold',
    });

    this.jade = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 4.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'jade',
    });

    this.rubber = new ProductUpgradeItem({
      game: this.game,
      parent: this,
      x: CONFIG.itemGap * 5.5,
      y: 0, //OFFSET + 120,
      product: this.product,
      prodTexture: 'rubber',
    });

  }

  _addAllChildren = () => {
    this.addChild(this.base);
    this.addChild(this.copper);
    this.addChild(this.silver);
    this.addChild(this.gold);
    this.addChild(this.jade);
    this.addChild(this.rubber);
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
      console.log('index: ', this.highlightedIndex);
      children[this.highlightedIndex].makeStrokeHighlightedOnly();
    } else if (highlightedChild.length === 2) {
      // 在本有高亮时候，点击升级
      console.log('点击新升级');
      highlightedChild[0].makeStrokeRegularAndStuff();
      this.highlightedIndex = upgradedChildren.length;
    } else if (highlightedChild.length === 1) {
      // 当前有有一个active的pie
      this.highlightedIndex = upgradedChildren.length;
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
    children[targetIndex].reopenBtns();
  }

  getActiveValue = () => {
    return this.active;
  }

  setActive = (value) => {
    this.active = value;
  }
}

export default ProductUpgradeLine;
