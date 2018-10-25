import range from '../js/libs/_/range';
import ProdPickItem from './ProdPickItem.js';

const RESO_LIST_MAP = {
  ore: ['steel', 'can', 'drill', 'toaster'],
  copper: ['battery', 'coffee_machine', 'mp3', 'speaker'],
  barrel: ['plasticBar', 'wheel', 'screen', 'phone'],
  plug: ['circuit', 'tv', 'computer', 'vr'],
  aluminium: ['engine', 'solarPanel', 'car', 'telescope'],
  rubber: ['projector', 'headset', 'walkieTalkie', 'radio']
};

const CONFIG = {
  frameColor: 0xb4a59d,
  frameTagW: 134,
  frameTagH: 58,
  frameTagColor: 0xcb6000,
  frameTagStroke: 6,
  frameTagStrokeC: 0xffd945,
  tagImgScale: 34 / 128,
  frameWidth: 553,
  frameHeight: 405,
  lockedBgColor: 0xa49a95,
  lockedBgHeight: 327,
  scaleFactor: 55 / 128
};

const RESO_TAGNAME_MAP = {
  ore: '铁矿',
  copper: '黄铜',
  barrel: '油桶',
  plug: '电器',
  aluminium: '铝器',
  rubber: '橡胶'
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize || '24px',
    fill: color || '#3a0a00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}


class ProdPickFrame extends window.Phaser.Group {
  constructor({game, reso, parentWidth, offsetTop, unlocked, modal}) {
    super(game);
    this.modal = modal;

    this.parentWidth = parentWidth;
    this.reso = reso;
    this.tagCnName = RESO_TAGNAME_MAP[reso];
    this.list = RESO_LIST_MAP[reso];
    this.offsetTop = offsetTop ? offsetTop : 0;

    this.lockDes = '请在仓库购买进口' + this.tagCnName + '原材料\n解锁生产这些产品，赚更多的钱';
    this.unlocked = unlocked; // should has a method 2 set 2 true
    this.active = false;


    this._getInit();
  }

  _getInit = () => {
    this._drawFrame();
    this._drawTag();
    this._drawTableHeading();
    this._drawItems();
    this._drawLockedItems();
    this._getFrameStateInit();
    this._addAllChildren();
    this.showCorrectFrameUI();
    this._initCorrectActiveValue();
  }

  _drawFrame = () => {
    let left = (this.parentWidth - CONFIG.frameWidth) / 2;
    this.frame = this.game.make.graphics(left, this.offsetTop);
    this.frame.beginFill(CONFIG.frameColor, 0.7);
    this.frame.drawRect(0, 0, CONFIG.frameWidth, CONFIG.frameHeight);
    this.frame.endFill();
  }

  _drawTag = () => {
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
    this.tag.alignTo(this.frame, Phaser.TOP_CENTER, -10, -40);

    // tag name txt
    this.tagName = this.game.make.text(
      0,
      0,
      this.tagCnName,
      getFontStyle('28px', '', '', 'bold')
    ); // fSize, color, align, weight

    this.tagName.alignTo(this.tag, Phaser.BOTTOM_LEFT, -20, -CONFIG.frameTagH);

    // tag img
    this.tagImg = this.game.make.image(0, 0, `reso_${this.reso}`);
    this.tagImg.scale.x = CONFIG.tagImgScale;
    this.tagImg.scale.y = CONFIG.tagImgScale;
    this.tagImg.alignTo(this.tagName, Phaser.RIGHT_BOTTOM, 5, -5);
  }

  _drawTableHeading = () => {
    // table heading background
    this.thBg = this.game.make.graphics(0, 0);
    this.thBg.beginFill(0x000000, 0.3);
    this.thBg.drawRect(0, 0, 550, 25);
    this.thBg.endFill();
    this.thBg.alignTo(this.frame, Phaser.TOP_LEFT, 0, -66);

    // table heading
    this.th1 = this.game.make.text(0, 0, '生产产品', getFontStyle('18px'));
    this.th2 = this.game.make.text(0, 0, '需要原料', getFontStyle('18px'));
    this.th3 = this.game.make.text(0, 0, '产品售价', getFontStyle('18px'));
    this.th4 = this.game.make.text(0, 0, '生产状态', getFontStyle('18px'));

    this.th1.alignTo(this.thBg, Phaser.TOP_LEFT, -25, -28);
    this.th2.alignTo(this.th1, Phaser.RIGHT_BOTTOM, 70, 0);
    this.th3.alignTo(this.th2, Phaser.RIGHT_BOTTOM, 70, 0);
    this.th4.alignTo(this.th3, Phaser.RIGHT_BOTTOM, 70, 0);
  }

  _drawItems = () => {
    this.itemGroup = this.game.make.group();
    range(4).forEach((item) => {
      this[`item${item}`] = new ProdPickItem({
        game: this.game,
        output: this.list[item],
        prodOrder: item + 1,
        parentFrame: this
      });
      if (item === 0) {
        this[`item${item}`].alignTo(this.thBg, Phaser.BOTTOM_LEFT, 0, 10);
      } else {
        this[`item${item}`].alignTo(this[`item${item - 1}`], Phaser.BOTTOM_LEFT, 0, 10);
      }
      this.itemGroup.addChild( this[`item${item}`]);
    });
  }

  _drawLockedItems = () => {
    this.lockedGroup = this.game.make.group();

    this.lockBg = this.game.make.graphics(0, 0);
    this.lockBg.beginFill(CONFIG.lockedBgColor);
    this.lockBg.drawRect(0, 0, CONFIG.frameWidth, CONFIG.lockedBgHeight);
    this.lockBg.endFill();
    this.lockBg.alignTo(this.thBg, Phaser.BOTTOM_LEFT, 0, 10);

    this.lockDesTxt = this.game.make.text(0, 0, this.lockDes, getFontStyle('22px', '', '', 'normal'));
    this.lockDesTxt.setTextBounds(0, 0, CONFIG.frameWidth, CONFIG.lockedBgHeight / 3);
    this.lockDesTxt.alignTo(this.lockBg, Phaser.TOP_LEFT, 0, -100);

    let gap = CONFIG.frameWidth / 8;
    this.prodGroup = this.game.make.group();
    this.list.forEach((item, index) => {
      this[`prod${index}`] = this.game.make.image(0, 0, `prod_${item}`);
      this[`prod${index}`].scale.x = CONFIG.scaleFactor;
      this[`prod${index}`].scale.y = CONFIG.scaleFactor;
      this[`prod${index}`].alignTo(this.lockDesTxt, Phaser.BOTTOM_LEFT, - gap*(1.4 + 1.5 * index), 45);
      this.prodGroup.addChild(this[`prod${index}`]);
    });

    this.lockedGroup.addChild(this.lockBg);
    this.lockedGroup.addChild(this.lockDesTxt);
    this.lockedGroup.addChild(this.prodGroup);
  }

  _getFrameStateInit = () => {
    if (this.unlocked === true) {
      this.lockedGroup.visible = false;
    }
  }

  _addAllChildren = () => {
    this.addChild(this.frame);
    this.addChild(this.tag);
    this.addChild(this.tagName);
    this.addChild(this.tagImg);
    this.addChild(this.thBg);
    range(4).forEach((item) => {
      this.addChild(this[`th${item+1}`]);
    });
    this.addChild(this.itemGroup);
    this.addChild(this.lockedGroup);

  }

  _getNextAvailableLockedItemIdx = () => {
    let targetItem = this.itemGroup.children.findIndex(item => {
      return item.flagBought === false;
    });
    return targetItem === -1 ? null : targetItem;
  }

  activateFrame = () => {
    this.active = true;
  }

  deactivateFrame = () => {
    this.active = false;
  }

  _initCorrectActiveValue = () => {
    let bool = this.itemGroup.children.some(item => {
      return item.flagActivated === true;
    });
    if (bool === true) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  showCorrectFrameUI = () => {
    let targetIdx = this._getNextAvailableLockedItemIdx();

    if (targetIdx === null) return true;
    this.itemGroup.children[targetIdx].setItem2BuyableUI();
    if (targetIdx + 1 <= this.itemGroup.children.length - 1) {
      this.itemGroup.children[targetIdx + 1].setItem2LockedUI();
    }
  }



  getUnlocked = () => {
    this.lockedGroup.visible = false;
  }

  getAllItemBtnCoinUpdated = (currCoin) => {
     this.itemGroup.children.forEach((item) => {
      item.getBtnCoinUpdated(currCoin);
    });
  }

  deactivateCurrActiveItem = () => {
    let item = this.itemGroup.children.find(item => item.flagActivated === true);
    item.setItem2BoughtNotActivatedUI();
    item.flagActivated = false;
    return this;
  }

  showCurrActivatedItem = () => {
    this.itemGroup.children
      .find(item => item.flagActivated === true)
      .setItem2Activated();
    this.activateFrame();
  }
}

export default ProdPickFrame;
